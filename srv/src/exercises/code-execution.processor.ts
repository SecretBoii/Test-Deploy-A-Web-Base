import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { spawn } from 'child_process';
import { ExercisesService } from './exercises.service';

@Processor('code-execution', { concurrency: 4 })
export class CodeExecutionProcessor extends WorkerHost {
  constructor(private readonly exercisesService: ExercisesService) {
    super();
  }

  async process(
    job: Job<{
      activityId: number;
      userId: number;
      exerciseId: number;
      sessionId: number;
      sourceCode: string;
      event_type: string;
      run_count: number;
      hintUsed: boolean;
    }>,
  ): Promise<{ status: string; stdout: string; stderr: string }> {
    const { activityId, exerciseId, sourceCode, event_type, run_count } = job.data;

    const wrapperScript = `
import sys, subprocess, os, tempfile
try:
    data = sys.stdin.read()
    parts = data.split('===INPUTS===')
    code = parts[0].strip()
    inputs = parts[1].strip() if len(parts) > 1 else ''
    
    sol_path = os.path.join(tempfile.gettempdir(), 'sol.py')
    with open(sol_path, 'w', encoding='utf-8') as f:
        f.write(code)
        
    res = subprocess.run(
        [sys.executable, sol_path],
        input=inputs,
        text=True,
        capture_output=True,
        timeout=4
    )
    sys.stdout.write(res.stdout)
    sys.stderr.write(res.stderr)
    sys.exit(res.returncode)
except subprocess.TimeoutExpired:
    sys.stderr.write('Time Limit Exceeded (Timeout 4s)')
    sys.exit(124)
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`.trim();

    const runWithDockerOrLocal = (): Promise<{ status: string; stdout: string; stderr: string }> => {
      return new Promise((resolve) => {
        let child = spawn('docker', [
          'run',
          '--rm',
          '-i',
          '--memory=128m',
          '--cpus=0.5',
          'python:3.10-slim',
          'python',
          '-c',
          wrapperScript,
        ]);

        let stdout = '';
        let stderr = '';
        let resolved = false;

        const timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            child.kill();
            resolve({
              status: 'Time Limit Exceeded',
              stdout,
              stderr: 'Execution timed out (5s limit exceeded)',
            });
          }
        }, 5000);

        const handleLocalFallback = () => {
          if (resolved) return;
          clearTimeout(timeoutId);
          console.log('[CodeExecution] Fallback to local python process...');
          
          const localChild = spawn('python', ['-c', wrapperScript]);
          let localStdout = '';
          let localStderr = '';

          const localTimeoutId = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              localChild.kill();
              resolve({
                status: 'Time Limit Exceeded',
                stdout: localStdout,
                stderr: 'Execution timed out (5s limit exceeded)',
              });
            }
          }, 5000);

          localChild.stdout.on('data', (d) => (localStdout += d.toString()));
          localChild.stderr.on('data', (d) => (localStderr += d.toString()));

          localChild.on('close', (code) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(localTimeoutId);
            resolve({
              status: code !== 0 ? 'Runtime Error' : 'Accepted',
              stdout: localStdout,
              stderr: localStderr,
            });
          });

          const mockInputs = '5\n10\n15\n20\nstudent\n';
          localChild.stdin.write(sourceCode + '\n===INPUTS===\n' + mockInputs);
          localChild.stdin.end();
        };

        child.on('error', () => {
          handleLocalFallback();
        });

        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('close', (code, signal) => {
          if (resolved) return;
          if (stderr.includes('Cannot connect to the Docker daemon') || stderr.includes('docker: command not found')) {
            handleLocalFallback();
            return;
          }

          resolved = true;
          clearTimeout(timeoutId);

          if (signal === 'SIGTERM' || signal === 'SIGKILL' || child.killed) {
            resolve({
              status: 'Time Limit Exceeded',
              stdout,
              stderr: 'Execution timed out (5s limit exceeded)',
            });
          } else if (code !== 0) {
            resolve({
              status: 'Runtime Error',
              stdout,
              stderr,
            });
          } else {
            resolve({
              status: 'Accepted',
              stdout,
              stderr,
            });
          }
        });

        const mockInputs = '5\n10\n15\n20\nstudent\n';
        const payload = sourceCode + '\n===INPUTS===\n' + mockInputs;

        child.stdin.write(payload);
        child.stdin.end();
      });
    };

    const runResult = await runWithDockerOrLocal();

    await this.exercisesService.completeGrading(
      activityId,
      runResult,
      event_type,
      run_count,
      exerciseId,
      sourceCode,
    );

    return runResult;
  }
}
