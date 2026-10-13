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

  private async requestAiAnalysis(prompt: string): Promise<string | null> {
    // 1. ลำดับแรก: ลองเรียก PSU Gemma
    const psuKey = this.configService.get<string>('GEMMA_PSU');
    const psuModel =
      this.configService.get<string>('GEMMA_MODEL') || 'PSU-LLM/psu-gemma';
    const psuUrl =
      this.configService.get<string>('GEMMA_API_URL') ||
      'https://ai.psu.blue/v1/chat/completions';

    if (psuKey) {
      try {
        this.logger.log(`[AI Primary] กำลังเรียก PSU Gemma: ${psuModel}`);
        const res = await firstValueFrom(
          this.httpService.post(
            psuUrl,
            {
              model: psuModel,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.2,
              max_tokens: 300,
              stream: false,
            },
            {
              headers: {
                Authorization: `Bearer ${psuKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json, text/plain, */*',
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              },
              timeout: 8000,
            },
          ),
        );
        const content = res?.data?.choices?.[0]?.message?.content;
        if (content && typeof content === 'string') {
          this.logger.log(`[AI Primary] PSU Gemma ตอบกลับสำเร็จ!`);
          return content;
        }
      } catch (err: unknown) {
        const errorDetail =
          (err as any)?.response?.data?.error?.message ||
          (err as any)?.response?.data ||
          (err as Error)?.message ||
          String(err);
        this.logger.warn(
          `[AI Primary] PSU Gemma ขัดข้อง (เตรียมสลับไป AI ตัวสำรอง): ${errorDetail}`,
        );
      }
    }

    // 2. ลำดับที่สอง: สลับไปใช้ Groq API (Qwen / Gemma)
    const groqKey = this.configService.get<string>('BACKUP_GROQ_KEY');
    const groqModel =
      this.configService.get<string>('BACKUP_GROQ_MODEL') || 'qwen/qwen3.8-27b';

    if (groqKey) {
      try {
        this.logger.log(`[AI Backup 1] กำลังเรียก Groq Cloud: ${groqModel}`);
        const res = await firstValueFrom(
          this.httpService.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
              model: groqModel,
              messages: [{ role: 'user', content: prompt }],
              temperature: 0.2,
              max_tokens: 300,
            },
            {
              headers: {
                Authorization: `Bearer ${groqKey}`,
                'Content-Type': 'application/json',
              },
              timeout: 10000,
            },
          ),
        );
        const content = res?.data?.choices?.[0]?.message?.content;
        if (content && typeof content === 'string') {
          this.logger.log(`[AI Backup 1] Groq Cloud ตอบกลับสำเร็จ!`);
          return content;
        }
      } catch (err: unknown) {
        const errorDetail =
          (err as any)?.response?.data?.error?.message ||
          (err as Error)?.message ||
          String(err);
        this.logger.warn(`[AI Backup 1] Groq Cloud ขัดข้อง: ${errorDetail}`);
      }
    }

    // 3. ลำดับที่สาม: สลับไปใช้ Google Gemini 2.5 Flash
    const geminiKey = this.configService.get<string>('BACKUP_GEMINI_KEY');

    if (geminiKey) {
      try {
        this.logger.log(`[AI Backup 2] กำลังเรียก Google Gemini 2.5 Flash`);
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
        const res = await firstValueFrom(
          this.httpService.post(
            geminiUrl,
            {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 300,
              },
            },
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 10000,
            },
          ),
        );
        const content = res?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (content && typeof content === 'string') {
          this.logger.log(`[AI Backup 2] Google Gemini ตอบกลับสำเร็จ!`);
          return content;
        }
      } catch (err: unknown) {
        const errorDetail =
          (err as any)?.response?.data?.error?.message ||
          (err as Error)?.message ||
          String(err);
        this.logger.warn(
          `[AI Backup 2] Google Gemini ขัดข้อง: ${errorDetail}`,
        );
      }
    }

    return null;
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

      const prompt = buildGemmaPrompt(
        sourceCode,
        runResult,
        event_type,
        run_count,
        exercise,
        (skillName) => this.getSkillGuideline(skillName),
      );

      // 1. บันทึกผลลัพธ์จาก Docker (stdout/stderr) ทันที (สถานะยังคง PENDING จนกว่า AI จะวิเคราะห์เสร็จ)
      await this.prisma.activity.update({
        where: { activityId },
        data: {
          output: runResult.stdout || null,
          exceptionMessage: runResult.stderr || null,
        },
      });

      // 2. ส่งข้อมูลไปประเมินผลผ่านระบบ Multi-tier AI (PSU Gemma -> Groq -> Gemini)
      const aiText = await this.requestAiAnalysis(prompt);

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

        // ป้องกันข้อความขัดแย้ง: ผูกข้อความสำรองให้สอดคล้องกับคะแนนจริง (ห้ามชมว่าถูกต้องเด็ดขาดหากคะแนนเป็น 0)
        finalFeedback =
          parsed.ai_feedback ??
          (finalScore >= 100
            ? 'โค้ดทำงานถูกต้องตามโจทย์เรียบร้อยแล้วครับ'
            : finalScore > 0
              ? 'โค้ดผ่านเงื่อนไขบางส่วน ลองตรวจสอบผลลัพธ์หรือเงื่อนไขเพิ่มเติมอีกนิดนะครับ'
              : 'ผลการรันโค้ดยังไม่ตรงกับเงื่อนไขของโจทย์ ลองตรวจสอบวิธีการคำนวณและผลลัพธ์อีกครั้งนะครับ');

        if (parsed.exception_message) {
          finalExceptionMessage = parsed.exception_message;
        }
      } else {
        // กรณีระบบ AI ภายนอกขัดข้องทั้งหมด จะไม่แจก 100 คะแนนเต็มให้โค้ดที่ยังไม่ผ่านการประเมินตรรกะ
        // แต่จะแสดงผลการรันจริงจาก Sandbox และแจ้งให้นักศึกษากดส่งตรวจอีกครั้ง
        this.logger.warn(
          `[Fallback Grading] Activity ID ${activityId}: AI ทุกตัวไม่ตอบกลับ ใช้การประเมินเบื้องต้นจาก Sandbox (Status: ${runResult.status})`,
        );
        finalScore = 0;
        finalFeedback =
          runResult.status === 'Accepted'
            ? 'โค้ดรันผ่านแล้ว แต่ระบบวิเคราะห์ AI ขัดข้องชั่วคราว โปรดตรวจสอบผลลัพธ์ใน Console Output และกดส่งตรวจใหม่อีกครั้งครับ'
            : 'โค้ดมีข้อผิดพลาดขณะทำงาน โปรดตรวจสอบรายละเอียดใน Console Output';
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
