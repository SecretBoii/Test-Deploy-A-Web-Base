import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { spawn } from 'child_process';
import { ExercisesGradingService } from './exercises-grading.service';

const TIMEOUT_LIMIT = 5; // กำหนด 5 วินาที

@Processor('code-execution', { concurrency: 4 })
export class CodeExecutionProcessor extends WorkerHost {
  constructor(private readonly gradingService: ExercisesGradingService) {
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
      testInput?: string;
    }>,
  ): Promise<{ status: string; stdout: string; stderr: string }> {
    const {
      activityId,
      exerciseId,
      sourceCode,
      event_type,
      run_count,
      testInput,
    } = job.data;

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
        timeout=${TIMEOUT_LIMIT}
    )
    sys.stdout.write(res.stdout)
    sys.stderr.write(res.stderr)
    sys.exit(res.returncode)
except subprocess.TimeoutExpired:
    sys.stderr.write('Time Limit Exceeded (Timeout ${TIMEOUT_LIMIT}s)')
    sys.exit(124)
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`.trim();

    const runDockerOnly = (): Promise<{
      status: string;
      stdout: string;
      stderr: string;
    }> => {
      return new Promise((resolve) => {
        const child = spawn('docker', [
          'run',
          '--rm',
          '-i',
          '--network',
          'none',
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

        const timeoutId = setTimeout(
          () => {
            if (!resolved) {
              resolved = true;
              child.kill();
              resolve({
                status: 'Time Limit Exceeded',
                stdout,
                stderr: `Execution timed out (${TIMEOUT_LIMIT}s limit exceeded)`,
              });
            }
          },
          TIMEOUT_LIMIT * 1000 + 1000,
        ); // ตั้งเวลารอ Node.js ให้ทำงานจนเสร็จ

        child.on('error', (err) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            resolve({
              status: 'Runtime Error',
              stdout: '',
              stderr: `Docker execution error: ${err.message}. Make sure Docker Desktop is running.`,
            });
          }
        });

        child.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('close', (code, signal) => {
          if (resolved) return;
          resolved = true;
          clearTimeout(timeoutId);

          if (signal === 'SIGTERM' || signal === 'SIGKILL' || child.killed) {
            resolve({
              status: 'Time Limit Exceeded',
              stdout,
              stderr: `Execution timed out (${TIMEOUT_LIMIT}s limit exceeded)`,
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

        const mockInputs = testInput ?? '5\n10\n15\n20\nstudent\n';
        const payload = sourceCode + '\n===INPUTS===\n' + mockInputs;

        child.stdin.write(payload);
        child.stdin.end();
      });
    };

    const runResult = await runDockerOnly();

    await this.gradingService.completeGrading(
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
