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

    const runResult = await new Promise<{ status: string; stdout: string; stderr: string }>((resolve) => {
      const child = spawn('docker', [
        'run',
        '--rm',
        '-i',
        '--memory=128m',
        '--cpus=0.5',
        'python:3.10-slim',
        'python',
      ]);

      let stdout = '';
      let stderr = '';
      let timeoutId: NodeJS.Timeout;

      timeoutId = setTimeout(() => {
        child.kill();
        resolve({
          status: 'Time Limit Exceeded',
          stdout: stdout,
          stderr: 'โค้ดใช้เวลาประมวลผลนานเกินไป (Timeout 5s)',
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
            stderr: 'โค้ดใช้เวลาประมวลผลนานเกินไป (Timeout 5s)',
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

      child.stdin.write(sourceCode);
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
