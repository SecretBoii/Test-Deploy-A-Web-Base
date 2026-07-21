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
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExercisesService implements OnModuleInit {
  private queueEvents: QueueEvents;
  private skillsGuideline = new Map<string, string>();

  constructor(
    private readonly httpService: HttpService,
    @InjectQueue('code-execution') private readonly codeQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit() {
    this.queueEvents = new QueueEvents('code-execution', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });

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
        console.warn(
          '[Skills Loader] ไม่พบโฟลเดอร์เกณฑ์การตรวจในพิกัดใดๆ:',
          possiblePaths,
        );
        return;
      }

      console.log(
        `[Skills Loader] กำลังโหลดไฟล์เกณฑ์การตรวจจากพิกัด: ${skillsDir}`,
      );

      const files = fs.readdirSync(skillsDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          const filePath = path.join(skillsDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const skillName = path.basename(file, '.md');
          this.skillsGuideline.set(skillName, content);
          console.log(
            `[Skills Loader] โหลดสำเร็จ: ${file} (${content.length} ตัวอักษร)`,
          );
        }
      }
      console.log(
        `[Skills Loader] โหลดเกณฑ์ทั้งหมดเสร็จสิ้น! จำนวน: ${this.skillsGuideline.size} รายการ`,
      );
    } catch (error) {
      console.error(`[Skills Loader] โหลดขัดข้อง:`, error.message);
    }
  }

  getSkillGuideline(skillName: string): string {
    const guideline = this.skillsGuideline.get(skillName);
    if (!guideline) {
      return `Please evaluate the student's ${skillName} skill and provide constructive feedback.`;
    }
    return guideline;
  }

  getLoadedSkills() {
    const obj: Record<string, string> = {};
    this.skillsGuideline.forEach((value, key) => {
      obj[key] = value.substring(0, 80) + '...';
    });
    return obj;
  }

  async submitExercise(
    userId: string,
    exerciseId: string,
    sourceCode: string,
    event_type: string,
    hintUsed: boolean,
  ) {
    try {
      const exercise = await this.prisma.exercise.findUnique({
        where: { exerciseId: Number(exerciseId) },
      });
      if (!exercise) {
        throw new HttpException('Exercise not found', HttpStatus.NOT_FOUND);
      }

      const previousRuns = await this.prisma.activity.count({
        where: {
          userId: Number(userId),
          exerciseId: Number(exerciseId),
          eventType: 'run',
        },
      });
      const run_count = event_type === 'run' ? previousRuns + 1 : previousRuns;

      const sessionExercise = await this.prisma.sessionExercise.findFirst({
        where: { exerciseId: Number(exerciseId) },
      });
      const sessionId = sessionExercise?.sessionId ?? 1;

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

      const job = await this.codeQueue.add('execute', {
        activityId: activity.activityId,
        userId: Number(userId),
        exerciseId: Number(exerciseId),
        sessionId: sessionId,
        sourceCode,
        event_type,
        run_count,
        hintUsed,
      });

      // รอให้การรันในคิวและ Gemini ประเมินผลเสร็จสิ้น
      await job.waitUntilFinished(this.queueEvents);

      // ดึงข้อมูลผลลัพธ์ที่ประมวลผลเสร็จแล้ว
      const updatedActivity = await this.prisma.activity.findUnique({
        where: { activityId: activity.activityId },
      });

      if (!updatedActivity) {
        throw new HttpException('Activity log not found after execution', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        activityId: updatedActivity.activityId,
        eventType: updatedActivity.eventType,
        
        // ฟิลด์ผลลัพธ์ตามที่ต้องการ
        status: updatedActivity.status === 'SUCCESS' ? 'success' : updatedActivity.status === 'PENDING' ? 'pending' : 'error',
        score: updatedActivity.score,
        runcount: updatedActivity.runCount,
        hintused: updatedActivity.hintUsed,
        exception_message: updatedActivity.exceptionMessage,
        ai_feedback: updatedActivity.aiFeedback,
      };
    } catch (error) {
      throw new HttpException(
        `Code submission failed: ${error.response?.data?.error?.message || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getStatus(activityId: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { activityId },
    });
    if (!activity) {
      throw new HttpException('Activity log not found', HttpStatus.NOT_FOUND);
    }

    return {
      success: true,
      activityId: activity.activityId,
      eventType: activity.eventType,
      status: activity.status === 'SUCCESS' ? 'success' : activity.status === 'PENDING' ? 'pending' : 'error',
      score: activity.score,
      runcount: activity.runCount,
      hintused: activity.hintUsed,
      exception_message: activity.exceptionMessage,
      ai_feedback: activity.aiFeedback,
    };
  }

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
        throw new Error(
          `Exercise ID ${exerciseId} not found for grading process`,
        );
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

      const prompt = this.buildGeminiPrompt(
        sourceCode,
        runResult,
        event_type,
        run_count,
        exercise,
      );

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
        console.error(
          'Primary model call failed:',
          apiError.response?.data?.error?.message || apiError.message,
        );
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
          console.error(
            '❌ Fallback model call failed:',
            fallbackError.response?.data?.error?.message ||
              fallbackError.message,
          );
          throw new Error(
            `Gemini grading pipeline failed: [Primary: ${apiError.response?.data?.error?.message || apiError.message}] [Fallback: ${fallbackError.response?.data?.error?.message || fallbackError.message}]`,
          );
        }
      }

      const candidates = geminiResponse.data?.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('Gemini returned no candidates response');
      }

      const aiText = candidates[0].content.parts[0].text;
      const defaultScore = runResult.status === 'Accepted' ? 10 : 0;
      const aiReview = this.parseAiResponse(
        aiText,
        defaultScore,
        event_type,
        run_count,
      );

      await this.prisma.activity.update({
        where: { activityId },
        data: {
          score: aiReview.score,
          exceptionMessage:
            aiReview.exception_message ?? (runResult.stderr ? runResult.stderr : runResult.stdout ? runResult.stdout : null),
            aiReview.exception_message ?? (runResult.stderr || null),
          aiFeedback: aiReview.ai_feedback,
          status: 'SUCCESS',
        },
      });
    } catch (error) {
      console.error(
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
      const cleanText = aiText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      try {
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
        exception_message: 'Failed to parse JSON structure',
        ai_feedback: `Could not parse AI response as JSON: ${parseError.message}`,
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
    const securityRules = this.getSkillGuideline('security');
    const complexityRules = this.getSkillGuideline('complexity');
    const pep8Rules = this.getSkillGuideline('pep8');
    const edgeCasesRules = this.getSkillGuideline('edge_cases');
    const dynamicRubricRules = this.getSkillGuideline('dynamic_rubric');

    let hintLevelInstruction = '';
    if (run_count <= 2) {
      hintLevelInstruction = `
        - Provide only high-level conceptual hints. Do not specify line numbers or point to the exact errors. Do not write any code solutions or code snippets under any circumstances.
      `;
    } else if (run_count <= 4) {
      hintLevelInstruction = `
        - Identify the general category of the logical error and narrow down the scope of the erroneous code block. Still, do not write code solutions for the user.
      `;
    } else {
      hintLevelInstruction = `
        - Point to the exact line numbers of the errors. Explain the root causes of the bugs clearly. You are allowed to provide code examples or refactoring suggestions to guide them.
      `;
    }

    return ` 
      Evaluate the student's Python program based on the following information:
      Exercise Title: "${exercise.title}"
      Topic: "${exercise.topic}"
      Objective/Rubric: "${exercise.objective}"
      
      Student's Source Code:
      "${sourceCode}"
      
      Execution Output from Sandbox:
      - Status: ${runResult.status}
      - Output: ${runResult.stdout || 'None'}
      - Error: ${runResult.stderr || 'None'}

      Additional rules to evaluate (use these criteria):
      [Security Check] ${securityRules}
      [Complexity/Big-O Check] ${complexityRules}
      [PEP 8 Cleanliness Check] ${pep8Rules}
      [Edge Cases Check] ${edgeCasesRules}
      [Dynamic Rubric Check] ${dynamicRubricRules}
      
      Hint rules you MUST follow for this run count:
      ${hintLevelInstruction}

      ====================================================
      CRITICAL INSTRUCTIONS FOR RESPONSE (JSON ONLY):
      Return a JSON object ONLY. Do not write any conversational intro, greetings, warnings, markdown wrappers, or outros.
      Both "exception_message" and "ai_feedback" MUST be extremely concise, direct, and straight-to-the-point, with no unnecessary explanations or fluff.
      
      - For "exception_message": If a compilation or runtime error occurred, provide only the short name/type of the exception (e.g. "ValueError" or "SyntaxError"). Do not explain the exception. If no error occurred, use null.
      - For "ai_feedback": Summarize the security, complexity/Big-O, PEP 8 cleanliness, and edge cases in a very brief, direct, and compact manner. Use a maximum of 1-2 short bullet points. Avoid general filler sentences or polite remarks. Keep it under 30 words total.

      The response must exactly follow this JSON schema:
      {
        "score": <overall evaluation score as an integer from 0 to 100>,
        "exception_message": "<extremely short exception type or null>",
        "ai_feedback": "<highly concise, direct, bulleted feedback without fluff (max 30 words)>"
      }
    `;
  }

  async getLevelsSummary(userId: number = 1) {
    const levels = [1, 2, 3, 4, 5];

    const results = await Promise.all(
      levels.map(async (lvl) => {
        const sessions = await this.prisma.session.findMany({
          where: { targetLevel: lvl, status: 'active' },
          include: { sessionExercises: true },
        });

        const totalSessions = sessions.length;
        const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
        const totalHours = Math.round(totalMinutes / 60) || 6;

        const exerciseIds = sessions.flatMap((s) =>
          s.sessionExercises.map((se) => se.exerciseId),
        );
        const totalExercises = exerciseIds.length;

        let completedExercises = 0;
        if (exerciseIds.length > 0) {
          const passedActivities = await this.prisma.activity.groupBy({
            by: ['exerciseId'],
            where: {
              userId: userId,
              exerciseId: { in: exerciseIds },
              score: { gt: 0 },
            },
          });
          completedExercises = passedActivities.length;
        }

        return {
          level: lvl,
          totalSessions,
          totalHours,
          totalExercises,
          completedExercises,
        };
      }),
    );

    return results;
  }

  async getLevelSessions(level: number, userId: number = 1) {
    const sessions = await this.prisma.session.findMany({
      where: { targetLevel: level, status: 'active' },
      orderBy: { sessionId: 'asc' },
      include: {
        sessionExercises: {
          orderBy: { sequenceOrder: 'asc' },
          include: { exercise: true },
        },
      },
    });

    const userActivities = await this.prisma.activity.findMany({
      where: { userId: userId, score: { gt: 0 } },
      select: { exerciseId: true },
    });
    const passedExerciseIds = new Set(userActivities.map((a) => a.exerciseId));

    const result = sessions.map((session) => {
      const exercises = session.sessionExercises.map((se, idx) => {
        const isPassed = passedExerciseIds.has(se.exerciseId);
        return {
          exerciseId: se.exerciseId,
          orderNumber: idx + 1,
          title: se.exercise.title,
          description: se.exercise.description,
          expectedTime: se.exercise.expectedTime,
          isPassed,
        };
      });

      const completedCount = exercises.filter((e) => e.isPassed).length;
      const totalExpectedTime = exercises.reduce((sum: number, e: any) => sum + e.expectedTime, 0);

      return {
        sessionId: session.sessionId,
        sessionName: session.sessionName,
        sessionObjective: session.sessionObjective,
        duration: totalExpectedTime || session.duration,
        totalExercises: exercises.length,
        completedExercises: completedCount,
        isCompleted: completedCount === exercises.length && exercises.length > 0,
        exercises,
      };
    });

    return result;
  }
}
