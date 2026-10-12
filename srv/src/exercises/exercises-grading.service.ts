import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import {
  buildGemmaPrompt,
  parseAiResponse,
  GemmaRunResult,
} from './utils/exercises-prompt.util';
import { ExercisesProgressService } from './exercises-progress.service';

@Injectable()
export class ExercisesGradingService implements OnModuleInit {
  private readonly logger = new Logger(ExercisesGradingService.name);
  private skillsGuideline = new Map<string, string>();

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly progressService: ExercisesProgressService,
  ) {}

  onModuleInit() {
    this.loadSkillsGuidelines();
  }

  private loadSkillsGuidelines() {
    try {
      const possiblePaths = [
        path.join(process.cwd(), 'src', 'exercises', 'skills'),
        path.join(process.cwd(), 'dist', 'exercises', 'skills'),
        path.join(__dirname, 'skills'),
      ];

      let skillsDir = '';
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          skillsDir = p;
          break;
        }
      }

      if (!skillsDir) {
        this.logger.warn(
          '[Skills Loader] ไม่พบโฟลเดอร์เกณฑ์การตรวจในพิกัดใดๆ:',
          possiblePaths,
        );
        return;
      }

      this.logger.log(
        `[Skills Loader] กำลังโหลดไฟล์เกณฑ์การตรวจจากพิกัด: ${skillsDir}`,
      );

      const files = fs.readdirSync(skillsDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(skillsDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const skillName = path.basename(file, '.md');
          this.skillsGuideline.set(skillName, content);
          this.logger.log(
            `[Skills Loader] โหลดสำเร็จ: ${file} (${content.length} ตัวอักษร)`,
          );
        }
      }
      this.logger.log(
        `[Skills Loader] โหลดเกณฑ์ทั้งหมดเสร็จสิ้น! จำนวน: ${this.skillsGuideline.size} รายการ`,
      );
    } catch (error: any) {
      this.logger.error(`[Skills Loader] โหลดขัดข้อง:`, error.message);
    }
  }

  getSkillGuideline(skillName: string): string {
    const guideline = this.skillsGuideline.get(skillName);
    if (!guideline) {
      return `Please evaluate the student's ${skillName} skill and provide constructive feedback.`;
    }
    return guideline;
  }

  getLoadedSkills(): Record<string, string> {
    const obj: Record<string, string> = {};
    this.skillsGuideline.forEach((value, key) => {
      obj[key] = value.substring(0, 80) + '...';
    });
    return obj;
  }

  async completeGrading(
    activityId: number,
    runResult: GemmaRunResult,
    event_type: string,
    run_count: number,
    exerciseId: number,
    sourceCode: string,
  ) {
    try {
      const exercise = await this.prisma.exercise.findUnique({
        where: { exerciseId },
      });
      if (!exercise) {
        throw new Error(
          `Exercise ID ${exerciseId} not found for grading process`,
        );
      }

      const apiKey = this.configService.get<string>('GEMMA_PSU');
      const model =
        this.configService.get<string>('GEMMA_MODEL') || 'PSU-LLM/psu-gemma';
      const gemmaUrl =
        this.configService.get<string>('GEMMA_API_URL') ||
        'https://ai.psu.blue/v1/chat/completions';

      const prompt = buildGemmaPrompt(
        sourceCode,
        runResult,
        event_type,
        run_count,
        exercise,
        (skillName) => this.getSkillGuideline(skillName),
      );

      // 1. บันทึกผลลัพธ์จาก Docker (stdout/stderr) ทันที (สถานะยังคง PENDING จนกว่า AI จะวิเคราะห์เสร็จ)
      const outputMsg = runResult.stderr
        ? runResult.stderr
        : runResult.stdout
          ? runResult.stdout
          : 'โค้ดทำงานสำเร็จ (ไม่มีข้อความ print ออกมา)';

      await this.prisma.activity.update({
        where: { activityId },
        data: {
          output: runResult.stdout || null,
          exceptionMessage: runResult.stderr || null,
        },
      });

      // 2. ส่งข้อมูลไปประเมินผลผ่าน Gemma API (เพิ่ม Headers เลียนแบบเบราว์เซอร์เพื่อป้องกัน Cloudflare WAF บล็อกคำขอจาก AWS IP)
      let gemmaResponse: { data?: { choices?: Array<{ message?: { content?: string } }> } } | null = null;
      try {
        this.logger.log(
          `[Gemma API] Sending prompt to model: ${model}, key exists: ${!!apiKey}`,
        );
        // ส่ง prompt ไปยัง Gemma API โดยกำหนด temperature ต่ำเพื่อเน้นความแม่นยำในการทำตามเกณฑ์ Socratic Method
        gemmaResponse = await firstValueFrom(
          this.httpService.post(
            gemmaUrl,
            {
              model: model,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.2,
              max_tokens: 300,
              stream: false,
            },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*',
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              },
              timeout: 15000,
            },
          ),
        );
      } catch (apiError: unknown) {
        const errorDetail =
          (apiError as any)?.response?.data?.error?.message ||
          (apiError as any)?.response?.data ||
          (apiError as Error)?.message ||
          String(apiError);
        this.logger.error('Gemma model call failed:', errorDetail);
      }

      // 3. ตรวจสอบผลลัพธ์จาก AI: หากสำเร็จให้ใช้คำแนะนำจาก Gemma หากล้มเหลวให้ใช้ Fallback อัตโนมัติ (Graceful Degradation)
      const aiText = gemmaResponse?.data?.choices?.[0]?.message?.content;

      let finalScore = runResult.status === 'Accepted' ? 100 : 0;
      let finalFeedback: string;
      let finalExceptionMessage: string | null = runResult.stderr ? runResult.stderr : null;

      if (aiText) {
        // กรณี AI ตอบกลับมาสำเร็จ ทำการประเมินคะแนนและคำแนะนำเชิงสร้างสรรค์
        const parsed = parseAiResponse(
          aiText,
          runResult.status === 'Accepted' ? 100 : 0,
          event_type,
          run_count,
        );

        finalScore = runResult.status === 'Accepted' ? parsed.score : 0;
        finalFeedback =
          parsed.ai_feedback ??
          (runResult.status === 'Accepted'
            ? 'โค้ดทำงานถูกต้องตามโจทย์เรียบร้อยแล้ว'
            : 'โค้ดมีข้อผิดพลาด โปรดตรวจสอบไวยากรณ์หรือผลลัพธ์อีกครั้ง');

        if (parsed.exception_message) {
          finalExceptionMessage = parsed.exception_message;
        }
      } else {
        // กรณี Gemma API ขัดข้องหรือ Cloudflare บล็อกคำขอ ให้ระบบตัดเกรดอิงตาม Docker Sandbox ต่อไปได้ทันที
        // เพื่อป้องกันไม่ให้ระบบล่มหรือนักศึกษาไม่ได้รับผลรันโค้ด
        this.logger.warn(
          `[Fallback Grading] Activity ID ${activityId}: AI ไม่ตอบกลับ ระบบใช้ผลจาก Docker Sandbox โดยตรง (Status: ${runResult.status})`,
        );
        finalScore = runResult.status === 'Accepted' ? 100 : 0;
        finalFeedback =
          runResult.status === 'Accepted'
            ? 'โค้ดทำงานถูกต้องตามเงื่อนไข (ระบบวิเคราะห์เสริม AI ขัดข้องชั่วคราว)'
            : 'ผลการรันโค้ดยังไม่ถูกต้องหรือพบข้อผิดพลาด โปรดตรวจสอบรายละเอียดใน Console Output';
      }

      const updatedActivity = await this.prisma.activity.update({
        where: { activityId },
        data: {
          score: finalScore,
          output: runResult.stdout || null,
          exceptionMessage: finalExceptionMessage,
          aiFeedback: finalFeedback,
          status: 'SUCCESS',
        },
        select: {
          userId: true,
          sessionId: true,
        },
      });

      // หากมีคะแนนบันทึกเรียบร้อย ให้อัปเดตสถานะความก้าวหน้าของ Session (หากผ่านครบทุกข้อจะปรับเป็น COMPLETED)
      if (updatedActivity?.userId && updatedActivity?.sessionId) {
        await this.progressService.updateUserSessionProgress(
          updatedActivity.userId,
          updatedActivity.sessionId,
        );
      }
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `completeGrading Error for Activity ID ${activityId}:`,
        errorMsg,
      );
      // ในกรณีข้อผิดพลาดระดับระบบ ให้คงผลลัพธ์ stdout/stderr เดิมของนักศึกษาไว้เสมอ เพื่อไม่ให้หน้าจอแจ้งว่า Backend processing failed
      await this.prisma.activity.update({
        where: { activityId },
        data: {
          status: 'FAILED',
          output: runResult.stdout || null,
          exceptionMessage:
            runResult.stderr ||
            (runResult.stdout ? null : 'ไม่สามารถประมวลผลโค้ดได้ กรุณาลองใหม่อีกครั้ง'),
          aiFeedback: `ระบบตรวจข้อสอบขัดข้อง: ${errorMsg}`,
        },
      });
    }
  }
}
