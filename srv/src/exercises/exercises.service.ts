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
import { ExercisesProgressService } from './exercises-progress.service';

@Injectable()
export class ExercisesService {
  private readonly logger = new Logger(ExercisesService.name);

  constructor(
    @InjectQueue('code-execution') private readonly codeQueue: Queue,
    private readonly prisma: PrismaService,
    private readonly progressService: ExercisesProgressService,
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

    // ตรวจสอบประวัติว่าผู้เรียนเคยกดเปิดดูคำใบ้ (Hint) ในรอบปัจจุบันของโจทย์ข้อนี้มาก่อนหรือไม่
    // ตามกติกา: ในรอบนั้นเมื่อเปิดใช้แล้วจะเปิดค้างไว้ตลอด จนกว่าจะกด Submit แล้วเริ่มทำรอบใหม่
    // จุดเริ่มต้นของรอบ:
    // 1. หากเคย Submit ให้ใช้เวลา submittedAt ของการส่งล่าสุด
    // 2. หากยังไม่เคย Submit ให้ดู Run แรกในรอบนี้ หรือไม่เกิน 4 ชั่วโมงล่าสุด เพื่อป้องกันประวัติข้ามวันมาเปิดค้าง
    let hintRoundStartTime: Date;
    if (latestSubmit) {
      hintRoundStartTime = latestSubmit.submittedAt;
    } else {
      const firstRunInRound = await this.prisma.activity.findFirst({
        where: {
          userId: Number(userId),
          exerciseId: id,
          eventType: 'run',
        },
        orderBy: {
          startedAt: 'asc',
        },
        select: { startedAt: true },
      });
      if (firstRunInRound) {
        hintRoundStartTime = new Date(
          firstRunInRound.startedAt.getTime() - 10 * 60 * 1000,
        );
      } else {
        hintRoundStartTime = new Date(Date.now() - 4 * 60 * 60 * 1000);
      }
    }

    const hintAuditLog = await this.prisma.auditLog.findFirst({
      where: {
        userId: Number(userId),
        action: 'VIEW_HINT',
        entity: 'Exercise',
        entityId: id,
        createdAt: {
          gt: hintRoundStartTime,
        },
      },
      select: { id: true },
    });

    return {
      ...exerciseData,
      sessions,
      runCount,
      hasUsedHint: Boolean(hintAuditLog),
    };
  }

  async recordHintUsage(userId: number, exerciseId: number) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { exerciseId: Number(exerciseId) },
    });
    if (!exercise) {
      throw new NotFoundException('ไม่พบแบบฝึกหัดที่ระบุ');
    }

    // การเปิดดูคำใบ้จะถูกบันทึกลง audit_log โดย Controller โดยตรง
    // โดยตาราง activity จะสงวนไว้สำหรับ event_type 'run' และ 'submit' เท่านั้น
    return {
      success: true,
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

        // ตรวจสอบสถานะการใช้งานคำใบ้ (Hint) ในรอบปัจจุบัน:
        // ผู้เรียนถือว่าใช้คำใบ้หาก: มีการบันทึกการขอคำใบ้ (action: 'VIEW_HINT') ในรอบปัจจุบัน (หลัง latestSubmit)
        let submitRoundStartTime: Date;
        if (latestSubmit) {
          submitRoundStartTime = latestSubmit.submittedAt;
        } else {
          const firstRun = await this.prisma.activity.findFirst({
            where: {
              userId: Number(userId),
              exerciseId: Number(exerciseId),
              eventType: 'run',
            },
            orderBy: { startedAt: 'asc' },
            select: { startedAt: true },
          });
          submitRoundStartTime = firstRun
            ? new Date(firstRun.startedAt.getTime() - 10 * 60 * 1000)
            : new Date(Date.now() - 4 * 60 * 60 * 1000);
        }

        const hintLog = await this.prisma.auditLog.findFirst({
          where: {
            userId: Number(userId),
            action: 'VIEW_HINT',
            entity: 'Exercise',
            entityId: Number(exerciseId),
            createdAt: {
              gt: submitRoundStartTime,
            },
          },
          select: { id: true },
        });
        const isHintUsed = Boolean(hintLog);

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

        // อัปเดตความก้าวหน้าระดับ Session ของผู้เรียนทันทีหลังส่งงานจริง
        await this.progressService.updateUserSessionProgress(userId, sessionId);

        return {
          success: true,
          activityId: activity.activityId,
          eventType: activity.eventType,
          status: 'success',
        };
      }

      // ค้นหาการส่งคำตอบล่าสุด เพื่อจำกัดขอบเขตการตรวจสอบ Hint เฉพาะรอบการทำโจทย์ปัจจุบัน
      const latestSubmitForRun = await this.prisma.activity.findFirst({
        where: {
          userId: Number(userId),
          exerciseId: Number(exerciseId),
          eventType: 'submit',
        },
        orderBy: {
          submittedAt: 'desc',
        },
        select: {
          submittedAt: true,
        },
      });

      // กรณี 'run' สร้าง Activity ชั่วคราวและส่งเข้าคิวงาน
      // ตรวจสอบว่าในรอบปัจจุบัน (หลัง latestSubmitForRun) มีการเปิดดูคำใบ้ (action: 'VIEW_HINT') หรือไม่
      let runRoundStartTime: Date;
      if (latestSubmitForRun) {
        runRoundStartTime = latestSubmitForRun.submittedAt;
      } else {
        const firstRun = await this.prisma.activity.findFirst({
          where: {
            userId: Number(userId),
            exerciseId: Number(exerciseId),
            eventType: 'run',
          },
          orderBy: { startedAt: 'asc' },
          select: { startedAt: true },
        });
        runRoundStartTime = firstRun
          ? new Date(firstRun.startedAt.getTime() - 10 * 60 * 1000)
          : new Date(Date.now() - 4 * 60 * 60 * 1000);
      }

      const hintLogForRun = await this.prisma.auditLog.findFirst({
        where: {
          userId: Number(userId),
          action: 'VIEW_HINT',
          entity: 'Exercise',
          entityId: Number(exerciseId),
          createdAt: {
            gt: runRoundStartTime,
          },
        },
        select: { id: true },
      });
      const isHintUsedForRun = Boolean(hintLogForRun);

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

      // อัปเดตความก้าวหน้าระดับ Session เป็น IN_PROGRESS ทันทีที่มีการเริ่มรันโค้ด
      await this.progressService.updateUserSessionProgress(userId, sessionId);

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
