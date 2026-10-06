import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto, UpdateSessionDto } from './dto';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * ดึงรายการ Session ทั้งหมดสำหรับอาจารย์ (เรียงตาม targetLevel และ sessionId)
   */
  async findAll() {
    const sessions = await this.prisma.session.findMany({
      orderBy: [{ targetLevel: 'asc' }, { sessionId: 'asc' }],
      include: {
        sessionExercises: {
          orderBy: { sequenceOrder: 'asc' },
          include: {
            exercise: {
              select: {
                exerciseId: true,
                title: true,
                topic: true,
                difficultyLevel: true,
                expectedTime: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return sessions.map((session) => ({
      sessionId: session.sessionId,
      sessionName: session.sessionName,
      sessionObjective: session.sessionObjective,
      targetLevel: session.targetLevel,
      duration: session.duration,
      status: session.status,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      exerciseCount: session.sessionExercises.length,
      exercises: (session.sessionExercises || [])
        .filter((se) => se.exercise)
        .map((se) => ({
          exerciseId: se.exercise.exerciseId,
          title: se.exercise.title || '',
          topic: se.exercise.topic || '',
          difficultyLevel: se.exercise.difficultyLevel || 1,
          expectedTime: se.exercise.expectedTime || 5,
          sequenceOrder: se.sequenceOrder,
          status: se.exercise.status || 'active',
        })),
    }));
  }

  /**
   * ดึงข้อมูล Session รายตัว
   */
  async findOne(id: number) {
    const session = await this.prisma.session.findUnique({
      where: { sessionId: id },
      include: {
        sessionExercises: {
          orderBy: { sequenceOrder: 'asc' },
          include: {
            exercise: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`ไม่พบ Session รหัส ${id}`);
    }

    return {
      ...session,
      exerciseIds: session.sessionExercises.map((se) => se.exerciseId),
    };
  }

  /**
   * สร้าง Session ใหม่ พร้อมผูกชุดโจทย์เข้า session_exercise (ตัดค่าซ้ำป้องกัน DB Constraint Error)
   */
  async create(dto: CreateSessionDto) {
    const { exerciseIds, ...sessionData } = dto;
    const uniqueExerciseIds = exerciseIds ? [...new Set(exerciseIds)] : [];

    return await this.prisma.$transaction(async (tx) => {
      const createdSession = await tx.session.create({
        data: {
          sessionName: sessionData.sessionName,
          sessionObjective: sessionData.sessionObjective,
          targetLevel: sessionData.targetLevel,
          duration: sessionData.duration,
          status: sessionData.status,
        },
      });

      if (uniqueExerciseIds.length > 0) {
        const sessionExercisesData = uniqueExerciseIds.map((exId, index) => ({
          sessionId: createdSession.sessionId,
          exerciseId: exId,
          sequenceOrder: index + 1,
        }));

        await tx.sessionExercise.createMany({
          data: sessionExercisesData,
        });
      }

      return createdSession;
    });
  }

  /**
   * แก้ไขข้อมูล Session และปรับชุดโจทย์ใน session_exercise
   */
  async update(id: number, dto: UpdateSessionDto) {
    await this.findOne(id);
    const { exerciseIds, ...sessionData } = dto;

    return await this.prisma.$transaction(async (tx) => {
      const updatedSession = await tx.session.update({
        where: { sessionId: id },
        data: {
          ...(sessionData.sessionName && {
            sessionName: sessionData.sessionName,
          }),
          ...(sessionData.sessionObjective && {
            sessionObjective: sessionData.sessionObjective,
          }),
          ...(sessionData.targetLevel && {
            targetLevel: sessionData.targetLevel,
          }),
          ...(sessionData.duration && { duration: sessionData.duration }),
          ...(sessionData.status && { status: sessionData.status }),
          updatedAt: new Date(),
        },
      });

      // หากมีการส่งรายการ exerciseIds มา ให้อัปเดตรายการจับคู่ใหม่
      if (exerciseIds !== undefined) {
        await tx.sessionExercise.deleteMany({
          where: { sessionId: id },
        });

        const uniqueExerciseIds = [...new Set(exerciseIds)];
        if (uniqueExerciseIds.length > 0) {
          const sessionExercisesData = uniqueExerciseIds.map(
            (exId: number, index: number) => ({
              sessionId: id,
              exerciseId: exId,
              sequenceOrder: index + 1,
            }),
          );

          await tx.sessionExercise.createMany({
            data: sessionExercisesData,
          });
        }
      }

      return updatedSession;
    });
  }

  /**
   * ลบ Session โดยตรวจสอบทั้ง User Progress และ Activity เพื่อไม่ให้ประวัตินักเรียนสูญหาย
   */
  async remove(id: number) {
    await this.findOne(id);

    // ตรวจสอบว่ามีนักเรียนเริ่มทำ Session หรือส่งงานไปแล้วหรือไม่
    const progressCount = await this.prisma.userSessionProgress.count({
      where: { sessionId: id },
    });
    const activityCount = await this.prisma.activity.count({
      where: { sessionId: id },
    });

    if (progressCount > 0 || activityCount > 0) {
      throw new BadRequestException(
        `ไม่สามารถลบ Session นี้ได้ เนื่องจากมีประวัติการเรียนหรือการส่งงานของนักเรียนแล้ว (${progressCount + activityCount} รายการ) แนะนำให้เปลี่ยนสถานะเป็น Inactive แทน`,
      );
    }

    return await this.prisma.$transaction(async (tx) => {
      await tx.sessionExercise.deleteMany({ where: { sessionId: id } });
      return await tx.session.delete({ where: { sessionId: id } });
    });
  }
}
