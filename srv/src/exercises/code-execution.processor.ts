import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { spawn } from 'child_process';
import { ExercisesService } from './exercises.service';

@Processor('code-execution', { concurrency: 4 }) // 👈 จำกัดการรัน Docker พร้อมกันสูงสุด 4 ตู้คอนเทนเนอร์
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
      // สั่งเปิดคอนเทนเนอร์แบบอินเตอร์แอคทีฟ (-i) จำกัดเวลาการรันผ่านระบบ NestJS และลบคอนเทนเนอร์หลังรันเสร็จ (--rm)
      const child = spawn('docker', [
        'run',
        '--rm',
        '-i',
        '--memory=128m', // จำกัดการใช้ RAM 128MB
        '--cpus=0.5', // จำกัดการใช้ CPU 0.5 Core
        'python:3.10-slim',
        'python',
      ]);

      let stdout = '';
      let stderr = '';
      let timeoutId: NodeJS.Timeout;

      // ตั้งกลไกหมดเวลาประมวลผล (Timeout 5 วินาที)
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

      // ส่งโค้ดของนักศึกษาผ่านทาง stdin เข้าไปยัง Python ใน Docker
      child.stdin.write(sourceCode);
      child.stdin.end();
    });

    // 🚀 ส่งผลลัพธ์ไปที่ ExercisesService เพื่อให้คะแนนด้วย AI และอัปเดตลง DB แบบ Asynchronous
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
