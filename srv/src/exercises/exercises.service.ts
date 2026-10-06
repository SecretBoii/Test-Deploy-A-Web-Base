import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExercisesService {
  private readonly logger = new Logger(ExercisesService.name);

  constructor(
    @InjectQueue('code-execution') private readonly codeQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async getExerciseById(exerciseId: number | string, userId?: number) {
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

    // ป้องกันกรณี userId เป็น undefined หรือ NaN เพื่อไม่ให้ระบบค้าง/Error ตอน Query Database
    if (!userId || isNaN(userId)) {
      return { ...exercise, runCount: 0, hasUsedHint: false };
    }

    const latestSubmit = await this.prisma.activity.findFirst({
      where: {
        userId: Number(userId),
        exerciseId: id,
        eventType: 'submit',
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });

    const runCount = await this.prisma.activity.count({
      where: {
        userId: Number(userId),
        exerciseId: id,
        eventType: 'run',
        ...(latestSubmit
          ? {
              submittedAt: {
                gt: latestSubmit.submittedAt,
              },
            }
          : {}),
      },
    });

    // ตรวจสอบประวัติว่าผู้เรียนเคยเปิดดูคำใบ้ (Hint) ในโจทย์ข้อนี้มาก่อนหรือไม่ เพื่อให้ Frontend จดจำสถานะได้
    // ใช้ select เฉพาะ activityId เพื่อลดภาระการดึงก้อนข้อมูลขนาดใหญ่จากฐานข้อมูล
    const hintActivity = await this.prisma.activity.findFirst({
      where: {
        userId: Number(userId),
        exerciseId: id,
        hintUsed: true,
      },
      select: { activityId: true },
    });

    return {
      ...exercise,
      runCount,
      hasUsedHint: Boolean(hintActivity),
    };
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

      const run_count =
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
        // ค้นหาการส่งคำตอบล่าสุด (latest submit) เพื่อนำมาจำกัดช่วงเวลาการค้นหา Run ล่าสุด
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

        // ค้นหาการรันโค้ดล่าสุดที่เกิดขึ้น *หลังจาก* การส่งคำตอบล่าสุด (ป้องกันการดึงผลการรันเก่าข้ามรอบ)
        const latestRun = await this.prisma.activity.findFirst({
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
            submittedAt: 'desc',
          },
        });

        if (!latestRun) {
          throw new BadRequestException(
            'กรุณากด Run Code เพื่อทดสอบโค้ดและตรวจผลลัพธ์ก่อนส่งคำตอบ',
          );
        }

        // ค้นหาการรันครั้งแรกนับจากการส่งครั้งก่อน เพื่อใช้เป็นจุดเริ่มต้นทำโจทย์
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

        // คำนวณเวลาเริ่มต้นทำโจทย์ (startedAt):
        // ป้องกันกรณีผู้เรียนเปิดหน้าจอทิ้งไว้ข้ามวัน (Idle Timeout เกิน 2 ชั่วโมง)
        const now = new Date();
        const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
        let startedAtTime = now;

        if (oldestRun) {
          const oldestDiff =
            now.getTime() - new Date(oldestRun.startedAt).getTime();
          if (oldestDiff >= 0 && oldestDiff <= TWO_HOURS_MS) {
            startedAtTime = oldestRun.startedAt;
          } else if (latestRun) {
            const latestDiff =
              now.getTime() - new Date(latestRun.startedAt).getTime();
            startedAtTime =
              latestDiff >= 0 && latestDiff <= TWO_HOURS_MS
                ? latestRun.startedAt
                : now;
          }
        }

        // ตรวจสอบสถานะการใช้งานคำใบ้ (Hint) อย่างครอบคลุม:
        // หากส่งมาเป็น true หรือรอบ Run ล่าสุดเป็น true อยู่แล้ว ให้ใช้ค่านั้นทันทีโดยไม่ต้อง Query ฐานข้อมูลซ้ำซ้อน
        let isHintUsed = Boolean(hintUsed || latestRun.hintUsed);
        if (!isHintUsed) {
          const hasUsedHintBefore = await this.prisma.activity.findFirst({
            where: {
              userId: Number(userId),
              exerciseId: Number(exerciseId),
              hintUsed: true,
            },
            select: { activityId: true },
          });
          isHintUsed = Boolean(hasUsedHintBefore);
        }

        const activity = await this.prisma.activity.create({
          data: {
            userId: Number(userId),
            exerciseId: Number(exerciseId),
            sessionId: sessionId,
            startedAt: startedAtTime,
            submittedAt: new Date(),
            hintUsed: isHintUsed,
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

      // กรณี 'run' สร้าง Activity ชั่วคราวและส่งเข้าคิวงาน
      // หากส่งมาเป็น true อยู่แล้ว ให้ใช้ได้ทันทีโดยไม่ต้อง Query ซ้ำซ้อน
      let isHintUsedForRun = Boolean(hintUsed);
      if (!isHintUsedForRun) {
        const hasUsedHintBeforeRun = await this.prisma.activity.findFirst({
          where: {
            userId: Number(userId),
            exerciseId: Number(exerciseId),
            hintUsed: true,
          },
          select: { activityId: true },
        });
        isHintUsedForRun = Boolean(hasUsedHintBeforeRun);
      }

      const activity = await this.prisma.activity.create({
        data: {
          userId: Number(userId),
          exerciseId: Number(exerciseId),
          sessionId: sessionId,
          startedAt: new Date(),
          submittedAt: new Date(),
          hintUsed: isHintUsedForRun,
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
        hintUsed: isHintUsedForRun,
        testInput: testInputs,
      });

      // คืนค่า activityId กลับไปให้ Frontend ทันที (ไม่ต้องรอคิวรันเสร็จ) เพื่อใช้ Polling
      return {
        success: true,
        activityId: activity.activityId,
        eventType: activity.eventType,
        status: 'pending',
      };
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
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

  async getAllExercisesForManage() {
    return await this.prisma.exercise.findMany({
      orderBy: { exerciseId: 'desc' },
    });
  }

  async createExercise(dto: any) {
    return await this.prisma.exercise.create({
      data: {
        title: dto.title,
        description: dto.description,
        topic: dto.topic,
        objective: dto.objective || '',
        difficultyLevel: dto.difficultyLevel,
        expectedTime: dto.expectedTime,
        status: dto.status,
        hint: dto.hint || '',
      },
    });
  }

  async updateExercise(exerciseId: number, dto: any) {
    const existing = await this.prisma.exercise.findUnique({
      where: { exerciseId },
    });
    if (!existing) {
      throw new NotFoundException(`Exercise ID ${exerciseId} not found`);
    }
    return await this.prisma.exercise.update({
      where: { exerciseId },
      data: dto,
    });
  }

  async deleteExercise(exerciseId: number) {
    const existing = await this.prisma.exercise.findUnique({
      where: { exerciseId },
    });
    if (!existing) {
      throw new NotFoundException(`Exercise ID ${exerciseId} not found`);
    }
    return await this.prisma.exercise.delete({
      where: { exerciseId },
    });
  }
}
