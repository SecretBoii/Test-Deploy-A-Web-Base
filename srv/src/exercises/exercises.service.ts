import {
  Injectable,
  OnModuleInit,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExercisesService implements OnModuleInit {
  private queueEvents: QueueEvents;

  constructor(
    private readonly httpService: HttpService,
    @InjectQueue('code-execution') private readonly codeQueue: Queue, // 👈 ฉีดคิวงานเข้ามาใช้งาน
    private readonly prisma: PrismaService, // 👈 ฉีด PrismaService เข้ามาใช้งาน
  ) {}

  onModuleInit() {
    // 👈 สร้างระบบติดตามความคืบหน้าของคิวงาน (QueueEvents) เพื่อรอผลการรันโค้ด
    this.queueEvents = new QueueEvents('code-execution', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  async submitExercise(
    userId: string,
    exerciseId: string,
    sourceCode: string,
    event_type: string,
    hintUsed: boolean,
  ) {
    try {
      // 1. ดึงข้อมูลโจทย์เพื่อนำเกณฑ์การตรวจและข้อมูลวิชามาใช้งาน
      const exercise = await this.prisma.exercise.findUnique({
        where: { exerciseId: Number(exerciseId) },
      });
      if (!exercise) {
        throw new HttpException('ไม่พบโจทย์ข้อนี้ในระบบ', HttpStatus.NOT_FOUND);
      }

      // 2. คำนวณจำนวนครั้งที่กดรันจริงจากฐานข้อมูล (ประวัติ Activity ที่มี eventType = 'run')
      const previousRuns = await this.prisma.activity.count({
        where: {
          userId: Number(userId),
          exerciseId: Number(exerciseId),
          eventType: 'run',
        },
      });
      const run_count = event_type === 'run' ? previousRuns + 1 : previousRuns;

      // 3. ค้นหา sessionId ของโจทย์ข้อนี้
      const sessionExercise = await this.prisma.sessionExercise.findFirst({
        where: { exerciseId: Number(exerciseId) },
      });
      const sessionId = sessionExercise?.sessionId ?? 1;

      // 4. สร้างบันทึกประวัติสถานะ PENDING ลงฐานข้อมูลก่อนรัน
      const activity = await this.prisma.activity.create({
        data: {
          userId: Number(userId),
          exerciseId: Number(exerciseId),
          sessionId: sessionId,
          startedAt: new Date(),
          submittedAt: new Date(),
          hintUsed: hintUsed,
          answer: sourceCode,
          score: 0,
          status: 'PENDING',
          eventType: event_type,
          runCount: run_count,
        },
      });

      // 5. ส่งงานเข้าระบบคิวประมวลผลเบื้องหลัง
      await this.codeQueue.add('execute', {
        activityId: activity.activityId,
        userId: Number(userId),
        exerciseId: Number(exerciseId),
        sessionId: sessionId,
        sourceCode,
        event_type,
        run_count,
        hintUsed,
      });

      // 6. ตอบกลับหน้าบ้านทันทีโดยไม่ต้องยิงรอ
      return {
        success: true,
        message: 'ส่งโค้ดเข้าระบบคิวประมวลผลสำเร็จ!',
        activityId: activity.activityId,
        status: 'PENDING',
      };
    } catch (error) {
      throw new HttpException(
        `การส่งโค้ดขัดข้อง: ${error.response?.data?.error?.message || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ดึงผลการตรวจคำตอบจากไอดีบันทึก
  async getStatus(activityId: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { activityId },
    });
    if (!activity) {
      throw new HttpException('ไม่พบข้อมูลประวัติการตรวจข้อนี้', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      activityId: activity.activityId,
      status: activity.status,
      score: activity.score,
      exceptionMessage: activity.exceptionMessage,
      aiFeedback: activity.aiFeedback,
      runCount: activity.runCount,
      eventType: activity.eventType,
    };
  }

  // ทำการวิเคราะห์ AI และอัปเดตสถานะของแบบฝึกหัดเสร็จสมบูรณ์ (เรียกใช้จาก Worker)
  async completeGrading(
    activityId: number,
    runResult: { status: string; stdout: string; stderr: string },
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
        throw new Error(`ไม่พบโจทย์ไอดี ${exerciseId} สำหรับขั้นตอนให้คะแนน`);
      }

      // 🚀 ยิงหา Gemini ด้วยรุ่นแบบไดนามิกจาก env
      const apiKey = process.env.GEMINI_API_KEY;
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

      const prompt = this.buildGeminiPrompt(sourceCode, runResult, event_type, run_count, exercise);

      let geminiResponse;
      try {
        geminiResponse = await firstValueFrom(
          this.httpService.post(
            geminiUrl,
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { 'Content-Type': 'application/json' } },
          ),
        );
      } catch (apiError) {
        console.error('❌ Primary model call failed:', apiError.response?.data?.error?.message || apiError.message);
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        try {
          geminiResponse = await firstValueFrom(
            this.httpService.post(
              fallbackUrl,
              { contents: [{ parts: [{ text: prompt }] }] },
              { headers: { 'Content-Type': 'application/json' } },
            ),
          );
        } catch (fallbackError) {
          console.error('❌ Fallback model call failed:', fallbackError.response?.data?.error?.message || fallbackError.message);
          throw new Error(
            `สายพานตรวจโค้ด Gemini ล้มเหลว: [Primary: ${apiError.response?.data?.error?.message || apiError.message}] [Fallback: ${fallbackError.response?.data?.error?.message || fallbackError.message}]`,
          );
        }
      }

      const candidates = geminiResponse.data?.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('Gemini ไม่ส่งข้อมูลตอบกลับมา');
      }

      const aiText = candidates[0].content.parts[0].text;
      const defaultScore = runResult.status === 'Accepted' ? 10 : 0;
      const aiReview = this.parseAiResponse(aiText, defaultScore, event_type, run_count);

      // บันทึกผลการตรวจและเปลี่ยนสถานะเป็น SUCCESS
      await this.prisma.activity.update({
        where: { activityId },
        data: {
          score: aiReview.score,
          exceptionMessage: aiReview.exception_message ?? (runResult.stderr || null),
          aiFeedback: aiReview.ai_feedback,
          status: 'SUCCESS',
        },
      });
    } catch (error) {
      console.error(`❌ completeGrading Error for Activity ID ${activityId}:`, error.message);
      // หากขั้นตอนใดๆ ล้มเหลว ให้ทำเครื่องหมายรายการนี้ว่า FAILED
      await this.prisma.activity.update({
        where: { activityId },
        data: {
          status: 'FAILED',
          exceptionMessage: 'ระบบประมวลผลหลังบ้านขัดข้อง',
          aiFeedback: `การตรวจล้มเหลว: ${error.message}`,
        },
      });
    }
  }

  private parseAiResponse(
    aiText: string,
    defaultScore: number,
    event_type: string,
    run_count: number,
  ): {
    score: number;
    exception_message: string | null;
    ai_feedback: string | null;
    event_type: string;
    run_count: number;
  } {
    const safe_event_type = event_type || 'submit';
    const safe_run_count = typeof run_count === 'number' ? run_count : 0;

    try {
      // 1. ทำความสะอาด markdown code blocks
      const cleanText = aiText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      try {
        // 2. ลอง Parse มาตรฐานก่อน
        const parsed = JSON.parse(cleanText);
        return {
          score: typeof parsed.score === 'number' ? parsed.score : defaultScore,
          exception_message: parsed.exception_message ?? null,
          ai_feedback: parsed.ai_feedback ?? null,
          event_type: parsed.event_type ?? safe_event_type,
          run_count:
            typeof parsed.run_count === 'number'
              ? parsed.run_count
              : safe_run_count,
        };
      } catch (innerParseError) {
        // 3. แผนสำรอง: ดึงผลลัพธ์ผ่าน Regex หากพบปัญหา Syntax
        const scoreMatch = cleanText.match(/"score"\s*:\s*(\d+)/);
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : defaultScore;

        const exceptionMatch = cleanText.match(
          /"exception_message"\s*:\s*"((?:[^"\\]|\\.)*)"/,
        );
        let exception_message: string | null = null;
        if (exceptionMatch) {
          exception_message = exceptionMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        }

        const feedbackMatch = cleanText.match(
          /"ai_feedback"\s*:\s*"((?:[^"\\]|\\.)*)"/,
        );
        let ai_feedback: string | null = null;
        if (feedbackMatch) {
          ai_feedback = feedbackMatch[1]
            .replace(/\\n/g, '\n')
            .replace(/\\"/g, '"')
            .replace(/\\\\/g, '\\');
        }

        return {
          score,
          exception_message: exception_message || null,
          ai_feedback: ai_feedback || null,
          event_type: safe_event_type,
          run_count: safe_run_count,
        };
      }
    } catch (parseError) {
      return {
        score: defaultScore,
        exception_message: 'ไม่สามารถแยกวิเคราะห์โครงสร้าง JSON ได้',
        ai_feedback: `ไม่สามารถแปลงผลวิเคราะห์จาก AI เป็น JSON ได้: ${parseError.message}`,
        event_type: safe_event_type,
        run_count: safe_run_count,
      };
    }
  }

  private buildGeminiPrompt(
    sourceCode: string,
    runResult: { status: string; stdout: string; stderr: string },
    event_type: string,
    run_count: number,
    exercise: { title: string; topic: string; objective: string },
  ): string {
    return `
      คุณคืออาจารย์ตรวจข้อสอบวิชาคอมพิวเตอร์ กำลังตรวจโจทย์ข้อ: "${exercise.title}"
      
      [วัตถุประสงค์เกณฑ์ตรวจของโจทย์ข้อนี้ (Dynamic Rubrics)]:
      - หัวข้อการเรียนรู้: ${exercise.topic}
      - วัตถุประสงค์หลักที่ต้องประเมิน: ${exercise.objective}

      [ข้อมูลการเรียกใช้งาน]:
      ชนิดของ event: ${event_type}
      จำนวนครั้งที่กดรัน (ไม่รวมครั้งนี้ถ้าเป็น submit): ${run_count}

      [ซอร์สโค้ดของนักศึกษา]:
      ${sourceCode}

      [ผลลัพธ์จากการรันใน Sandbox]:
      สถานะ: ${runResult.status}
      Output: ${runResult.stdout || 'ไม่มี output'}
      Error (ถ้ามี): ${runResult.stderr || 'ไม่มี'}

      โปรดส่งผลลัพธ์การตรวจกลับมาเป็นรูปแบบ JSON Object เท่านั้น โดยมีโครงสร้างดังนี้:
      {
        "score": <คะแนนที่ตรวจได้เป็นตัวเลข 0 ถึง 100>,
        "exception_message": "<หากเกิด error ให้ระบุชื่อ exception สั้นกระชับที่สุด เช่น 'NameError: name 'x' is not defined' หรือเป็น null หากไม่มีข้อผิดพลาด>",
        "ai_feedback": "<ระบุจุดที่ต้องแก้ไขทันทีเพื่อให้สอดคล้องกับวัตถุประสงค์หลักของโจทย์ข้อนี้ เป็นข้อสั้นๆ ห้ามมีคำอธิบายอารัมภบท ทักทาย ชมเชย หรือคำปลอบใจใดๆ ทั้งสิ้น หรือเป็น null หากได้คะแนนเต็ม 10>",
        "event_type": "${event_type}",
        "run_count": ${run_count}
      }

      ⚠️ ข้อบังคับเด็ดขาดในการตอบกลับ:
      1. ห้ามมีข้อความอื่นนอกเหนือจาก JSON Object ห้ามมีคำทักทาย เกริ่นนำ อารัมภบท หรือลงท้ายใดๆ ทั้งสิ้น
      2. ข้อความใน "ai_feedback" ต้องชี้เป้าจุดผิดและแนวทางการแก้ปัญหาตรงๆ ทันที (ห้ามใช้คำพูดเกริ่น เช่น "ขอแนะนำให้...", "โค้ดของคุณเกือบถูกต้องแล้ว...")
      3. เนื้อหาทั้งหมดต้องสั้นและตรงประเด็นที่สุด (มีแต่เนื้อ ไม่มีน้ำ) และยาวไม่เกิน 2-3 บรรทัดย่อย
      4. ห้ามใช้การกดปุ่มขึ้นบรรทัดใหม่จริง ๆ (Raw Newlines/Line breaks) ภายในข้อความ JSON
      5. หากต้องการแยกบรรทัดในคำแนะนำ ให้พิมพ์ตัวอักษร \\n (ย้อนกลับสแลชตามด้วยตัว n) แทนการขึ้นบรรทัดใหม่จริง ๆ
    `;
  }
}
