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

      // 2. ส่งข้อมูลไปประเมินผลผ่าน Gemma API
      let gemmaResponse: any;
      try {
        this.logger.log(
          `[Gemma API] Sending prompt to model: ${model}, key exists: ${!!apiKey}`,
        );
        gemmaResponse = await firstValueFrom(
          this.httpService.post(
            gemmaUrl,
            {
              model: model,
              messages: [{ role: 'user', content: prompt }],
              stream: false,
            },
            {
              headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
            },
          ),
        );
      } catch (apiError: any) {
        this.logger.error(
          'Gemma model call failed:',
          apiError.response?.data?.error?.message ||
            apiError.response?.data ||
            apiError.message,
        );
      }

      // 3. เมื่อ Gemma ตอบกลับมา บันทึกคะแนนและคำแนะนำ แล้วปรับ status เป็น SUCCESS
      const aiText = gemmaResponse?.data?.choices?.[0]?.message?.content;

      if (!aiText) {
        throw new Error(
          'AI Grading response is empty or Gemma API call failed.',
        );
      }

      let aiReview = {
        score: runResult.status === 'Accepted' ? 100 : 0,
        exception_message: outputMsg as string | null,
        ai_feedback:
          runResult.status === 'Accepted'
            ? 'โค้ดทำงานถูกต้องตามโจทย์เรียบร้อยแล้ว'
            : 'โค้ดมีข้อผิดพลาด โปรดตรวจสอบไวยากรณ์หรือผลลัพธ์อีกครั้ง',
      };

      const defaultScore = runResult.status === 'Accepted' ? 100 : 0;
      const parsed = parseAiResponse(
        aiText,
        defaultScore,
        event_type,
        run_count,
      );

      aiReview = {
        score: parsed.score,
        exception_message:
          parsed.exception_message ??
          (runResult.stderr ? runResult.stderr : null),
        ai_feedback: parsed.ai_feedback ?? aiReview.ai_feedback,
      };

      const finalScore = runResult.status === 'Accepted' ? aiReview.score : 0;

      const updatedActivity = await this.prisma.activity.update({
        where: { activityId },
        data: {
          score: finalScore,
          output: runResult.stdout || null,
          exceptionMessage: aiReview.exception_message,
          aiFeedback: aiReview.ai_feedback,
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
    } catch (error: any) {
      this.logger.error(
        `completeGrading Error for Activity ID ${activityId}:`,
        error.message,
      );
      await this.prisma.activity.update({
        where: { activityId },
        data: {
          status: 'FAILED',
          exceptionMessage: 'Backend processing failed',
          aiFeedback: `Grading failed: ${error.message}`,
        },
      });
    }
  }
}
