import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';

@Injectable()
export class ExercisesService {
  private readonly logger = new Logger(ExercisesService.name);

  constructor(
    @InjectQueue('code-execution') private readonly codeQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}


  async getExerciseById(
    exerciseId: number | string,
    userId?: number,
    userRoleId?: number,
  ) {
    const id = Number(exerciseId);
    if (isNaN(id)) {
      throw new BadRequestException('Invalid exercise ID');
    }
    const exercise = await this.prisma.exercise.findUnique({
      where: { exerciseId: id },
      include: {
        sessionExercises: {
          include: {
            session: {
              select: {
                sessionId: true,
                sessionName: true,
                status: true,
              },
            },
          },
          orderBy: { sequenceOrder: 'asc' },
        },
      },
    });
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    // ป้องกันนักเรียนเข้าถึงโจทย์ที่ปิดใช้งาน
    if (userRoleId === 1 && exercise.status !== 'active') {
      throw new ForbiddenException(
        'แบบฝึกหัดนี้ยังไม่เปิดให้เข้าใช้งานหรือถูกปิดใช้งานชั่วคราว',
      );
    }

    const { sessionExercises, ...exerciseData } = exercise;
    const sessions = (sessionExercises || [])
      .filter((se) => se.session)
      .map((se) => ({
        sessionId: se.session.sessionId,
        sessionName: se.session.sessionName,
        status: se.session.status,
      }));

    // ป้องกันกรณี userId เป็น undefined หรือ NaN เพื่อไม่ให้ระบบค้าง/Error ตอน Query Database
    if (!userId || isNaN(userId)) {
      return { ...exerciseData, sessions, runCount: 0, hasUsedHint: false };
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
      ...exerciseData,
      sessions,
      runCount,
      hasUsedHint: Boolean(hintActivity),
    };
  }

  async recordHintUsage(userId: number, exerciseId: number) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { exerciseId: Number(exerciseId) },
    });
    if (!exercise) {
      throw new NotFoundException('ไม่พบแบบฝึกหัดที่ระบุ');
    }

    // ตรวจสอบว่าเคยมีประวัติเปิดคำใบ้ในข้อนี้แล้วหรือไม่ หากมีแล้วไม่ต้องสร้างซ้ำซ้อน
    const existingHint = await this.prisma.activity.findFirst({
      where: {
        userId: Number(userId),
        exerciseId: Number(exerciseId),
        hintUsed: true,
      },
      select: { activityId: true },
    });

    if (existingHint) {
      return { success: true, message: 'เคยบันทึกการใช้คำใบ้ไปแล้ว' };
    }

    // ดึง sessionId จาก sessionExercise ที่เกี่ยวข้อง หรือ fallback เป็น 1
    const sessionExercise = await this.prisma.sessionExercise.findFirst({
      where: { exerciseId: Number(exerciseId) },
    });
    const sessionId = sessionExercise?.sessionId ?? 1;

    const activity = await this.prisma.activity.create({
      data: {
        userId: Number(userId),
        exerciseId: Number(exerciseId),
        sessionId,
        startedAt: new Date(),
        submittedAt: new Date(),
        hintUsed: true,
        answer: '',
        score: 0,
        status: 'HINT_USED',
        eventType: 'hint',
        runCount: 0,
      },
    });

    return {
      success: true,
      activityId: activity.activityId,
      message: 'บันทึกการใช้งานคำใบ้สำเร็จ',
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
    userRoleId?: number,
  ) {
    try {
      const exercise = await this.prisma.exercise.findUnique({
        where: { exerciseId },
      });
      if (!exercise) {
        throw new NotFoundException('Exercise not found');
      }

      // ป้องกันนักเรียนรันหรือส่งตรวจโจทย์ที่ปิดใช้งาน
      if (userRoleId === 1 && exercise.status !== 'active') {
        throw new ForbiddenException(
          'ไม่สามารถรันหรือส่งตรวจได้ เนื่องจากแบบฝึกหัดนี้ถูกปิดใช้งานชั่วคราว',
        );
      }

      // หาก Frontend ส่ง runCountParam มาให้แล้ว ให้ใช้ค่านั้นทันทีเพื่อประหยัด Database I/O
      let run_count: number;
      if (typeof runCountParam === 'number') {
        run_count = runCountParam;
      } else {
        const previousRuns = await this.prisma.activity.count({
          where: {
            userId,
            exerciseId,
            eventType: 'run',
          },
        });
        run_count = event_type === 'run' ? previousRuns + 1 : previousRuns;
      }

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

      const testInputs = '5\n10\n15\n20\nstudent\n';

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
    } catch (error: unknown) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(
        `Code submission failed: ${message}`,
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

  /**
   * ดึงรายการแบบฝึกหัดทั้งหมดสำหรับมุมมองอาจารย์และแอดมิน (จัดการคลังโจทย์)
   * ทำการ include ความสัมพันธ์ sessionExercises และ session เพื่อให้หน้าพรีวิวโจทย์ (ExercisePreviewDialog)
   * และหน้าจัดการแบบฝึกหัดทราบว่าโจทย์แต่ละข้อถูกนำไปบรรจุไว้ในบทเรียน (Session) ใดบ้าง
   */
  async getAllExercisesForManage() {
    const exercises = await this.prisma.exercise.findMany({
      orderBy: { exerciseId: 'desc' },
      include: {
        sessionExercises: {
          include: {
            session: {
              select: {
                sessionId: true,
                sessionName: true,
                status: true,
              },
            },
          },
          orderBy: { sequenceOrder: 'asc' },
        },
      },
    });

    return exercises.map((ex) => {
      const { sessionExercises, ...rest } = ex;
      return {
        ...rest,
        sessions: (sessionExercises || [])
          .filter((se) => se.session)
          .map((se) => ({
            sessionId: se.session.sessionId,
            sessionName: se.session.sessionName,
            status: se.session.status,
          })),
      };
    });
  }

  async createExercise(dto: CreateExerciseDto) {
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

  async updateExercise(exerciseId: number, dto: UpdateExerciseDto) {
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
      throw new NotFoundException(`ไม่พบโจทย์รหัส ${exerciseId}`);
    }

    // 1. ตรวจสอบประวัติการเข้าทำหรือการส่งงานของนักเรียน
    const activityCount = await this.prisma.activity.count({
      where: { exerciseId },
    });
    if (activityCount > 0) {
      throw new BadRequestException(
        `ไม่สามารถลบโจทย์นี้ได้ เนื่องจากมีประวัติการเข้าทำหรือการส่งงานของนักเรียนแล้ว (${activityCount} รายการ) แนะนำให้เปลี่ยนสถานะเป็น Inactive แทน`,
      );
    }

    // 2. ตรวจสอบว่าโจทย์นี้ถูกผูกเข้ากับชุดบทเรียนใดอยู่หรือไม่
    const sessionExerciseCount = await this.prisma.sessionExercise.count({
      where: { exerciseId },
    });
    if (sessionExerciseCount > 0) {
      throw new BadRequestException(
        `ไม่สามารถลบโจทย์นี้ได้ เนื่องจากถูกใช้งานอยู่ในชุดบทเรียน (${sessionExerciseCount} บทเรียน) กรุณานำโจทย์ออกจากบทเรียนก่อน หรือเปลี่ยนสถานะเป็น Inactive แทน`,
      );
    }

    return await this.prisma.exercise.delete({
      where: { exerciseId },
    });
  }
}
