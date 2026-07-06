import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { spawn } from 'child_process';

@Processor('code-execution', { concurrency: 4 }) // 👈 จำกัดการรัน Docker พร้อมกันสูงสุด 4 ตู้คอนเทนเนอร์
export class CodeExecutionProcessor extends WorkerHost {
  async process(job: Job<{ sourceCode: string }>): Promise<{ status: string; stdout: string; stderr: string }> {
    const { sourceCode } = job.data;

    return new Promise((resolve) => {
      // สั่งเปิดคอนเทนเนอร์แบบอินเตอร์แอคทีฟ (-i) จำกัดเวลาการรันผ่านระบบ NestJS และลบคอนเทนเนอร์หลังรันเสร็จ (--rm)
      const child = spawn('docker', [
        'run',
        '--rm',
        '-i',
        '--memory=128m',       // จำกัดการใช้ RAM 128MB
        '--cpus=0.5',          // จำกัดการใช้ CPU 0.5 Core
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
  }
}
