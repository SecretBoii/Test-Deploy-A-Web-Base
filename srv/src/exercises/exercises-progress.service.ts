import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// แมปตัวเลข Level จาก Frontend (1-5) ไปยังข้อความระดับความยากในฐานข้อมูล
const LEVEL_MAP: Record<number, string> = {
  1: 'Basic',
  2: 'Intermediate',
  3: 'Advanced',
  4: 'Advanced',
  5: 'Advanced',
};

@Injectable()
export class ExercisesProgressService {
  private readonly logger = new Logger(ExercisesProgressService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getLevelsSummary(userId: number = 1) {
    try {
      const levels = [1, 2, 3, 4, 5];

      const results = await Promise.all(
        levels.map(async (lvl) => {
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
                score: { gte: 80 },
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
    } catch (err: any) {
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
        score: { gte: 80 },
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
          score: { gte: 80 },
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
            score: { gte: 80 },
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
    } catch (err: any) {
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
          score: { gte: 80 },
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
    } catch (err: any) {
      this.logger.error('Error in getDashboardStats:', err);
      throw err;
    }
  }

  async getHistory(userId: number, limit?: number, page: number = 1) {
    try {
      if (limit === undefined) {
        return await this.prisma.activity.findMany({
          where: { userId },
          orderBy: { submittedAt: 'desc' },
          include: {
            exercise: true,
            session: true,
          },
        });
      }

      const skip = (page - 1) * limit;
      const [item, total] = await Promise.all([
        this.prisma.activity.findMany({
          where: { userId },
          orderBy: { submittedAt: 'desc' },
          take: limit,
          skip,
          include: {
            exercise: true,
            session: true,
          },
        }),
        this.prisma.activity.count({
          where: { userId },
        }),
      ]);

      return {
        item,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      };
    } catch (err: any) {
      this.logger.error('Error in getHistory:', err);
      throw err;
    }
  }
}
