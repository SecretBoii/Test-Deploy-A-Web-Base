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
import sys, subprocess
try:
    data = sys.stdin.read()
    parts = data.split('===INPUTS===')
    code = parts[0].strip()
    inputs = parts[1].strip() if len(parts) > 1 else ''
    
    with open('/tmp/sol.py', 'w', encoding='utf-8') as f:
        f.write(code)
        
    res = subprocess.run(
        [sys.executable, '/tmp/sol.py'],
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

    const runResult = await new Promise<{ status: string; stdout: string; stderr: string }>((resolve) => {
      const child = spawn('docker', [
        'run',
        '--rm',
        '-i',
        '--memory=128m',
        '--cpus=0.5',
        'python:3.10-slim',
        'python',
        '-c',
        wrapperScript
      ]);

      let stdout = '';
      let stderr = '';
      let timeoutId: NodeJS.Timeout;

      timeoutId = setTimeout(() => {
        child.kill();
        resolve({
          status: 'Time Limit Exceeded',
          stdout: stdout,
          stderr: 'Execution timed out (5s limit exceeded)',
        });
      }, 5000);

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code, signal) => {
        clearTimeout(timeoutId);

        if (signal === 'SIGTERM' || signal === 'SIGKILL' || child.killed) {
          resolve({
            status: 'Time Limit Exceeded',
            stdout: stdout,
            stderr: 'Execution timed out (5s limit exceeded)',
          });
        } else if (code !== 0) {
          resolve({
            status: 'Runtime Error',
            stdout: stdout,
            stderr: stderr,
          });
        } else {
          resolve({
            status: 'Accepted',
            stdout: stdout,
            stderr: stderr,
          });
        }
      });

      const mockInputs = "5\n10\n15\n20\nstudent\n";
      const payload = sourceCode + "\n===INPUTS===\n" + mockInputs;

      child.stdin.write(payload);
      child.stdin.end();
    });

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
