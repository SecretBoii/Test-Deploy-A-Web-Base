import {
  Injectable,
  OnModuleInit,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';
import { firstValueFrom, last } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { session } from 'passport';
import { SourceCode } from 'eslint';

// Map จากตัวเลข Level (Frontend) → String ที่เก็บในฐานข้อมูล
const LEVEL_MAP: Record<number, string> = {
  1: 'Basic',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Advanced',
  5: 'Advanced',
};

@Injectable()
export class ExercisesService implements OnModuleInit {
  private readonly logger = new Logger(ExercisesService.name);
  private queueEvents: QueueEvents;
  private skillsGuideline = new Map<string, string>();

  constructor(
    private readonly httpService: HttpService,
    @InjectQueue('code-execution') private readonly codeQueue: Queue,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.queueEvents = new QueueEvents('code-execution', {
      connection: {
        host: this.configService.get<string>('REDIS_HOST') || '127.0.0.1',
        port: this.configService.get<number>('REDIS_PORT') || 6379,
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
    } catch (error) {
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

  getLoadedSkills() {
    const obj: Record<string, string> = {};
    this.skillsGuideline.forEach((value, key) => {
      obj[key] = value.substring(0, 80) + '...';
    });
    return obj;
  }

  async getExerciseById(exerciseId: number | string) {
    const id = Number(exerciseId);
    if (isNaN(id)) {
      throw new BadRequestException('Invalid exercise ID');
    }
    const exercise = await this.prisma.exercise.findUnique({
      where: { exerciseId: id },
    });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }
    return exercise;
  }

  async submitExercise(
    userId: number,
    exerciseId: number,
    sourceCode: string,
    event_type: string,
    hintUsed: boolean,
    sessionIdParam?: number,
    runCountParam?: number,
  ) {
    try {
      const exercise = await this.prisma.exercise.findUnique({
        where: { exerciseId },
      });
      if (!exercise) {
        throw new NotFoundException('Exercise not found');
      }

      const previousRuns = await this.prisma.activity.count({
        where: {
          userId,
          exerciseId,
          eventType: 'run',
        },
      });

      let run_count =
        typeof runCountParam === 'number'
          ? runCountParam
          : event_type === 'run'
            ? previousRuns + 1
            : previousRuns;

      let sessionId = sessionIdParam ? sessionIdParam : 1;

      if (!sessionIdParam) {
        const sessionExercise = await this.prisma.sessionExercise.findFirst({
          where: { exerciseId },
        });
        sessionId = sessionExercise?.sessionId ?? 1;
      }

      if (event_type === 'submit') {
        const latestRun = await this.prisma.activity.findFirst({
          where: {
            userId: Number(userId),
            exerciseId: Number(exerciseId),
            eventType: 'run',
          },
          orderBy: {
            submittedAt: 'desc',
          },
        });

        if (!latestRun) {
          throw new BadRequestException(
            'กรุณากด Run Code เพื่อทดสอบโค้ดและตรวจผลลัพธ์ก่อนส่งคำตอบ',
          );
        }

        // Find the most recent submit activity for this user and exercise to measure current attempt time
        const latestSubmit = await this.prisma.activity.findFirst({
          where: {
            userId: Number(userId),
            exerciseId: Number(exerciseId),
            eventType: 'submit',
          },
          orderBy: {
            submittedAt: 'desc',
          },
        });

        // Find the oldest run since the last submission (or overall if no previous submission exists)
        const oldestRun = await this.prisma.activity.findFirst({
          where: {
            userId: Number(userId),
            exerciseId: Number(exerciseId),
            eventType: 'run',
            ...(latestSubmit
              ? {
                  submittedAt: {
                    gt: latestSubmit.submittedAt,
                  },
                }
              : {}),
          },
          orderBy: {
            submittedAt: 'asc',
          },
        });

        const startedAtTime = oldestRun ? oldestRun.startedAt : new Date();

        const activity = await this.prisma.activity.create({
          data: {
            userId: Number(userId),
            exerciseId: Number(exerciseId),
            sessionId: sessionId,
            startedAt: startedAtTime,
            submittedAt: new Date(),
            hintUsed: latestRun.hintUsed,
            answer: latestRun.answer,
            score: latestRun.score,
            status: 'SUCCESS',
            eventType: 'submit',
            runCount: run_count,
            output: latestRun.output,
            exceptionMessage: latestRun.exceptionMessage,
            aiFeedback: latestRun.aiFeedback,
          },
        });

        return {
          success: true,
          activityId: activity.activityId,
          eventType: activity.eventType,
          status: 'success',
        };
      }

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

      const inputMap: Record<number, string> = {
        101: '5\n10\n',
        102: '1\n2\n0\n',
      };

      const testInputs = inputMap[exerciseId] ?? '5\n10\n15\n20\nstudent\n';

      await this.codeQueue.add('execute', {
        activityId: activity.activityId,
        userId,
        exerciseId,
        sessionId,
        sourceCode,
        event_type,
        run_count,
        hintUsed,
        testInput: testInputs,
      });

      // คืนค่า activityId กลับไปให้ Frontend ทันที (ไม่ต้องรอ job ทำงานเสร็จ)
      // เพื่อให้ Frontend นำ activityId ไป Poll ดูสถานะได้ทันทีโดยไม่ค้างรอ HTTP Response
      return {
        success: true,
        activityId: activity.activityId,
        eventType: activity.eventType,
        status: 'pending',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Code submission failed: ${error.response?.data?.error?.message || error.message}`,
      );
    }
  }

  async getStatus(activityId: number) {
    const activity = await this.prisma.activity.findUnique({
      where: { activityId },
      include: {
        exercise: true,
        session: true,
      },
    });
    if (!activity) {
      throw new NotFoundException('Activity log not found');
    }

    return {
      success: true,
      activityId: activity.activityId,
      eventType: activity.eventType,
      status:
        activity.status === 'SUCCESS'
          ? 'success'
          : activity.status === 'PENDING'
            ? 'pending'
            : 'error',
      rawStatus: activity.status,
      score: activity.score,
      runCount: activity.runCount,
      hintUsed: activity.hintUsed,
      output: activity.output,
      exceptionMessage: activity.exceptionMessage,
      aiFeedback: activity.aiFeedback,
      exerciseId: activity.exerciseId,
      sessionId: activity.sessionId,
      sourceCode: activity.answer,
      exerciseTitle: activity.exercise?.title,
      exerciseDescription: activity.exercise?.description,
      targetLevel: activity.session?.targetLevel,
      startedAt: activity.startedAt,
      submittedAt: activity.submittedAt,
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

      const apiKey = this.configService.get<string>('GEMMA_PSU');
      const model =
        this.configService.get<string>('GEMMA_MODEL') || 'PSU-LLM/psu-gemma';
      const gemmaUrl =
        this.configService.get<string>('GEMMA_API_URL') ||
        'https://ai.psu.blue/v1/chat/completions';
      const prompt = this.buildGemmaPrompt(
        sourceCode,
        runResult,
        event_type,
        run_count,
        exercise,
      );

      // 1. บันทึกผลลัพธ์จาก Docker (stdout/stderr) ทันที (ยังคง status = PENDING เพื่อให้ Frontend ยังคง Poll ต่อจนกว่า Gemma จะเสร็จ)
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

      // 2. ส่งข้อมูลไปประเมินผลผ่าน Gemma API เท่านั้น
      let gemmaResponse;
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
      } catch (apiError) {
        this.logger.error(
          'Gemma model call failed:',
          apiError.response?.data?.error?.message ||
            apiError.response?.data ||
            apiError.message,
        );
      }

      // 3. เมื่อ Gemma ตอบกลับมา บันทึกคะแนนและคำแนะนำ แล้วปรับ status เป็น SUCCESS
      const aiText = gemmaResponse?.data?.choices?.[0]?.message?.content;

      // ป้องกันการให้คะแนน 100 แบบสุ่มสี่สุ่มห้า หาก API ยิงไม่ผ่าน
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
      const parsed = this.parseAiResponse(
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

      await this.prisma.activity.update({
        where: { activityId },
        data: {
          score: finalScore,
          output: runResult.stdout || null,
          exceptionMessage: aiReview.exception_message,
          aiFeedback: aiReview.ai_feedback,
          status: 'SUCCESS',
        },
      });
    } catch (error) {
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

  private buildGemmaPrompt(
    sourceCode: string,
    runResult: { status: string; stdout: string; stderr: string },
    event_type: string,
    run_count: number,
    exercise: {
      title: string;
      description: string;
      topic: string;
      objective: string;
    },
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
      Exercise Description: "${exercise.description}"
      Topic: "${exercise.topic}"
      Objective/Rubric: "${exercise.objective}"
      
      Student's Source Code:
      "${sourceCode}"
      
      Execution Output from Sandbox:
      - Status: ${runResult.status}
      - Output: ${runResult.stdout || 'None'}
      - Error: ${runResult.stderr || 'None'}

      Additional rules to evaluate (use these criteria):
      [Correctness Check] Evaluate the student's code and execution output based on its proximity/closeness to the requirements described in the 'Exercise Description'. If the printed output or logic is completely correct, award a score of 100. If it is partially correct (e.g., minor typos, case mismatch such as printing "Hello Python" or "hello python" instead of "Welcome to Python", or slightly incorrect output format), deduct some score proportionally (e.g. award a partial score like 50 to 80 points) and explain in the feedback what is slightly incorrect. Give a score of 0 only if the output or logic is completely wrong, unrelated, or failed to compile/run.
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
      
      - For "score": <overall evaluation score as an integer from 0 to 100>,
      - For "exception_message": If a compilation or runtime error occurred, provide only the short name/type of the exception (e.g. "ValueError" or "SyntaxError"). Do not explain the exception. If no error occurred, use null.
      - For "ai_feedback": ให้ตอบเป็นข้อความประโยคภาษาไทยปกติที่เป็นธรรมชาติและกระชับในการแนะนำผู้เรียน (ห้ามตอบเป็นหัวข้อขีดลบภาษาอังกฤษเด็ดขาด)
        * หากโค้ดยังไม่ผ่านเกณฑ์ หรือทำเงื่อนไขไม่ครบตามโจทย์: ให้ระบุจุดที่บกพร่องตรงๆ โดยขึ้นต้นประโยคทำนองว่า "ยังทำไม่ครบตามโจทย์..." หรือ "ควรปรับปรุงโค้ดส่วน..." แล้วตามด้วยคำแนะนำที่สั้นและกระชับ
        * หากโค้ดทำงานถูกต้องเรียบร้อยแล้ว: ให้ตอบชื่นชมสั้นๆ และเสนอแนะจุดที่พัฒนาเพิ่มเติมได้ เช่น "โค้ดถูกต้องและทำงานได้ดีครับ แต่ควรเพิ่ม comment เพื่อความอ่านง่ายขึ้น"
        * ให้ควบคุมความยาวใหอยูในช่วง 1-2 ประโยคสั้นๆ กระชับและได้ใจความที่สุด

      The response must exactly follow this JSON schema:
      {
        "score": <overall evaluation score as an integer from 0 to 100>,
        "exception_message": "<extremely short exception type or null>",
        "ai_feedback": "<highly concise, friendly Thai feedback sentence (max 30 words)>"
      }
    `;
  }

  async getLevelsSummary(userId: number = 1) {
    try {
      const levels = [1, 2, 3, 4, 5];

      const results = await Promise.all(
        levels.map(async (lvl) => {
          const levelString = LEVEL_MAP[lvl];
          const sessions = await this.prisma.session.findMany({
            where: { targetLevel: lvl, status: 'active' },
            include: { sessionExercises: true },
          });

          const totalSessions = sessions.length;
          const totalMinutes = sessions.reduce(
            (sum: number, s: any) => sum + s.duration,
            0,
          );
          const totalHours = Math.round(totalMinutes / 60) || 6;

          const exerciseIds = sessions.flatMap((s: any) =>
            (s.sessionExercises || []).map((se: any) => se.exerciseId),
          );
          const totalExercises = exerciseIds.length;

          let completedExercises = 0;
          if (exerciseIds.length > 0) {
            const passedActivities = await this.prisma.activity.findMany({
              where: {
                userId: userId,
                exerciseId: { in: exerciseIds },
                OR: [{ eventType: 'submit' }, { score: { gt: 0 } }],
              },
              select: { exerciseId: true },
              distinct: ['exerciseId'],
            });
            completedExercises = passedActivities.length;
          }

          return {
            level: lvl,
            totalSessions,
            totalHours,
            totalExercises,
            completedExercises,
            sessionName:
              sessions.length > 0 ? sessions[0].sessionName : undefined,
            sessionObjective:
              sessions.length > 0 ? sessions[0].sessionObjective : undefined,
          };
        }),
      );

      return results;
    } catch (err) {
      this.logger.error('Error in getLevelsSummary:', err);
      throw err;
    }
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
      where: {
        userId: userId,
        OR: [{ eventType: 'submit' }, { score: { gt: 0 } }],
      },
      select: { exerciseId: true },
    });
    const passedExerciseIds = new Set(userActivities.map((a) => a.exerciseId));

    const result = sessions.map((session: any) => {
      const exercises = (session.sessionExercises || []).map(
        (se: any, idx: number) => {
          const isPassed = passedExerciseIds.has(se.exerciseId);
          return {
            exerciseId: se.exerciseId,
            orderNumber: idx + 1,
            title: se.exercise?.title || '',
            description: se.exercise?.description || '',
            expectedTime: se.exercise?.expectedTime || 5,
            isPassed,
          };
        },
      );

      const completedCount = exercises.filter((e: any) => e.isPassed).length;
      const totalExpectedTime = exercises.reduce(
        (sum: number, e: any) => sum + e.expectedTime,
        0,
      );

      return {
        sessionId: session.sessionId,
        sessionName: session.sessionName,
        sessionObjective: session.sessionObjective,
        duration: totalExpectedTime || session.duration,
        totalExercises: exercises.length,
        completedExercises: completedCount,
        isCompleted:
          completedCount === exercises.length && exercises.length > 0,
        exercises,
      };
    });

    return result;
  }

  private async isSessionCompleted(
    userId: number,
    sessionId: number,
  ): Promise<boolean> {
    const session = await this.prisma.session.findUnique({
      where: { sessionId },
      include: {
        sessionExercises: true,
      },
    });
    if (
      !session ||
      !session.sessionExercises ||
      session.sessionExercises.length === 0
    ) {
      return true;
    }

    const exerciseIds = session.sessionExercises.map((se) => se.exerciseId);
    const passedActivitiesCount = await this.prisma.activity
      .findMany({
        where: {
          userId,
          exerciseId: { in: exerciseIds },
          score: { gt: 0 },
        },
        select: { exerciseId: true },
        distinct: ['exerciseId'],
      })
      .then((res) => res.length);

    return passedActivitiesCount === exerciseIds.length;
  }

  async getRecentSession(userId: number) {
    try {
      // 1. หา Sessions ล่าสุดที่ผู้ใช้เคยส่ง Activity (เรียงจากใหม่ไปเก่า)
      const recentActivities = await this.prisma.activity.findMany({
        where: { userId },
        orderBy: { submittedAt: 'desc' },
        select: { sessionId: true },
      });

      const targetSessionIds: number[] = [];
      for (const act of recentActivities) {
        if (act.sessionId && !targetSessionIds.includes(act.sessionId)) {
          const isCompleted = await this.isSessionCompleted(
            userId,
            act.sessionId,
          );
          if (!isCompleted) {
            targetSessionIds.push(act.sessionId);
            if (targetSessionIds.length >= 3) break;
          }
        }
      }

      // 2. ถ้ายังไม่ครบ 3 ให้หาจาก UserSessionProgress
      if (targetSessionIds.length < 3) {
        const recentProgress = await this.prisma.userSessionProgress.findMany({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          select: { sessionId: true },
        });
        for (const prog of recentProgress) {
          if (prog.sessionId && !targetSessionIds.includes(prog.sessionId)) {
            const isCompleted = await this.isSessionCompleted(
              userId,
              prog.sessionId,
            );
            if (!isCompleted) {
              targetSessionIds.push(prog.sessionId);
              if (targetSessionIds.length >= 3) break;
            }
          }
        }
      }

      // 3. ถ้ายังไม่ครบ 3 ให้ backfill จาก Session ทั้งหมดที่มีสถานะ active
      if (targetSessionIds.length < 3) {
        const activeSessions = await this.prisma.session.findMany({
          where: { status: 'active' },
          orderBy: [{ targetLevel: 'asc' }, { sessionId: 'asc' }],
          select: { sessionId: true },
        });
        for (const sess of activeSessions) {
          if (sess.sessionId && !targetSessionIds.includes(sess.sessionId)) {
            const isCompleted = await this.isSessionCompleted(
              userId,
              sess.sessionId,
            );
            if (!isCompleted) {
              targetSessionIds.push(sess.sessionId);
              if (targetSessionIds.length >= 3) break;
            }
          }
        }
      }

      // 4. ดึงข้อมูลรายละเอียดของแต่ละ Session และหาความก้าวหน้า
      const result = [];
      for (const targetSessionId of targetSessionIds) {
        const session = await this.prisma.session.findUnique({
          where: { sessionId: targetSessionId },
          include: {
            sessionExercises: {
              orderBy: { sequenceOrder: 'asc' },
              include: { exercise: true },
            },
          },
        });

        if (!session) continue;

        // หาโจทย์ที่ผ่านแล้วของ User ใน session นี้
        const userActivities = await this.prisma.activity.findMany({
          where: {
            userId,
            sessionId: targetSessionId,
            score: { gt: 0 },
          },
          select: { exerciseId: true },
        });
        const passedExerciseIds = new Set(
          userActivities.map((a) => a.exerciseId),
        );

        const exercises = (session.sessionExercises || []).map(
          (se: any, idx: number) => {
            const isPassed = passedExerciseIds.has(se.exerciseId);
            return {
              exerciseId: se.exerciseId,
              orderNumber: idx + 1,
              title: se.exercise?.title || '',
              description: se.exercise?.description || '',
              expectedTime: se.exercise?.expectedTime || 5,
              isPassed,
            };
          },
        );

        const completedCount = exercises.filter((e: any) => e.isPassed).length;
        const totalExpectedTime = exercises.reduce(
          (sum: number, e: any) => sum + e.expectedTime,
          0,
        );

        result.push({
          sessionId: session.sessionId,
          sessionName: session.sessionName,
          sessionObjective: session.sessionObjective,
          duration: totalExpectedTime || session.duration,
          totalExercises: exercises.length,
          completedExercises: completedCount,
          targetLevel: session.targetLevel,
          exercises,
        });
      }

      return result;
    } catch (err) {
      this.logger.error('Error in getRecentSession:', err);
      throw err;
    }
  }

  async getDashboardStats(userId: number) {
    try {
      const totalExercises = await this.prisma.exercise.count({
        where: { status: 'active' },
      });

      const completedActivities = await this.prisma.activity.findMany({
        where: {
          userId,
          score: { gt: 0 },
        },
        select: { exerciseId: true },
        distinct: ['exerciseId'],
      });
      const completedExercises = completedActivities.length;

      const submissions = await this.prisma.activity.aggregate({
        where: { userId, eventType: 'submit' },
        _avg: { score: true },
      });
      const averageScore = Math.round(submissions._avg.score || 0);

      return {
        totalExercises,
        completedExercises,
        averageScore,
        streakDays: 5,
      };
    } catch (err) {
      this.logger.error('Error in getDashboardStats:', err);
      throw err;
    }
  }

  async getHistory(userId: number, limit?: number) {
    try {
      return await this.prisma.activity.findMany({
        where: { userId },
        orderBy: { submittedAt: 'desc' },
        ...(limit ? { take: limit } : {}),
        include: {
          exercise: true,
          session: true,
        },
      });
    } catch (err) {
      this.logger.error('Error in getHistory:', err);
      throw err;
    }
  }
}
