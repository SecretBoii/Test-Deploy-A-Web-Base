import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExercisesProgressService {
  private readonly logger = new Logger(ExercisesProgressService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getLevelsSummary(userId: number = 1) {
    try {
      // 1. ดึงข้อมูล Session ที่มีสถานะ active ทุกระดับ (1-5) พร้อมโจทย์ active ในคำสั่งเดียว (Query 1)
      const sessions = await this.prisma.session.findMany({
        where: {
          targetLevel: { in: [1, 2, 3, 4, 5] },
          status: 'active',
        },
        include: {
          sessionExercises: {
            where: { exercise: { status: 'active' } },
            select: { exerciseId: true },
          },
        },
      });

      // 2. รวบรวมรหัสโจทย์แบบไม่ซ้ำ (Unique Exercise IDs) ทั้งหมด
      const allExerciseIds = Array.from(
        new Set(
          sessions.flatMap((s) =>
            (s.sessionExercises || []).map((se) => se.exerciseId),
          ),
        ),
      );

      // 3. ดึงเฉพาะโจทย์ที่นักเรียนทำผ่านเกณฑ์ (score >= 80) ในคำสั่งเดียว (Query 2)
      let passedExerciseIdSet = new Set<number>();
      if (allExerciseIds.length > 0) {
        const passedActivities = await this.prisma.activity.findMany({
          where: {
            userId,
            exerciseId: { in: allExerciseIds },
            score: { gte: 80 },
          },
          select: { exerciseId: true },
          distinct: ['exerciseId'],
        });
        passedExerciseIdSet = new Set(passedActivities.map((a) => a.exerciseId));
      }

      // 4. คำนวณสรุปผลรายระดับ (Level 1-5) ภายในหน่วยความจำ (In-Memory Processing)
      const levels = [1, 2, 3, 4, 5];
      const results = levels.map((lvl) => {
        const levelSessions = sessions.filter((s) => s.targetLevel === lvl);
        const totalSessions = levelSessions.length;
        const totalMinutes = levelSessions.reduce(
          (sum, s) => sum + s.duration,
          0,
        );
        const totalHours = Math.round(totalMinutes / 60) || 6;

        // ดึงรหัสโจทย์แบบไม่ซ้ำในระดับนี้ เพื่อไม่ให้นับซ้ำหากโจทย์ถูกจัดอยู่ในหลาย Session
        const uniqueLevelExerciseIds = Array.from(
          new Set(
            levelSessions.flatMap((s) =>
              (s.sessionExercises || []).map((se) => se.exerciseId),
            ),
          ),
        );
        const totalExercises = uniqueLevelExerciseIds.length;
        const completedExercises = uniqueLevelExerciseIds.filter((id) =>
          passedExerciseIdSet.has(id),
        ).length;

        return {
          level: lvl,
          totalSessions,
          totalHours,
          totalExercises,
          completedExercises,
          sessionName:
            levelSessions.length > 0 ? levelSessions[0].sessionName : undefined,
          sessionObjective:
            levelSessions.length > 0
              ? levelSessions[0].sessionObjective
              : undefined,
        };
      });

      return results;
    } catch (err: unknown) {
      this.logger.error(
        'Error in getLevelsSummary:',
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async getLevelSessions(level: number, userId: number = 1) {
    const sessions = await this.prisma.session.findMany({
      where: { targetLevel: level, status: 'active' },
      orderBy: { sessionId: 'asc' },
      include: {
        sessionExercises: {
          where: { exercise: { status: 'active' } },
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
      distinct: ['exerciseId'],
    });
    const passedExerciseIds = new Set(userActivities.map((a) => a.exerciseId));

    const result = sessions.map((session) => {
      const exercises = (session.sessionExercises || []).map(
        (se, idx: number) => {
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

      const completedCount = exercises.filter((e) => e.isPassed).length;
      const totalExpectedTime = exercises.reduce(
        (sum, e) => sum + e.expectedTime,
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

  async getRecentSession(userId: number) {
    try {
      // 1. ดึงประวัติ Session IDs ที่ผู้ใช้มีปฏิสัมพันธ์ล่าสุดแบบ Parallel ในครั้งเดียว
      const [recentActivities, recentProgress, activeSessions] =
        await Promise.all([
          // 1.1 ดึง Session ล่าสุดที่ผู้เรียนเคยส่งงาน (จำกัด 30 รายการ)
          this.prisma.activity.findMany({
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            select: { sessionId: true },
            distinct: ['sessionId'],
            take: 30,
          }),
          // 1.2 ดึง Session ล่าสุดจาก UserSessionProgress (จำกัด 15 รายการ)
          this.prisma.userSessionProgress.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            select: { sessionId: true },
            take: 15,
          }),
          // 1.3 ดึง Session ที่สถานะ active ทั้งหมดเพื่อใช้เป็น Fallback
          this.prisma.session.findMany({
            where: { status: 'active' },
            orderBy: [{ targetLevel: 'asc' }, { sessionId: 'asc' }],
            select: { sessionId: true },
          }),
        ]);

      // รวม Candidate Session IDs ตามลำดับความสำคัญ (Recent Activities -> Recent Progress -> Active Sessions)
      const candidateSessionIds: number[] = [];
      const seenSessionIds = new Set<number>();

      for (const act of recentActivities) {
        if (act.sessionId && !seenSessionIds.has(act.sessionId)) {
          seenSessionIds.add(act.sessionId);
          candidateSessionIds.push(act.sessionId);
        }
      }

      for (const prog of recentProgress) {
        if (prog.sessionId && !seenSessionIds.has(prog.sessionId)) {
          seenSessionIds.add(prog.sessionId);
          candidateSessionIds.push(prog.sessionId);
        }
      }

      for (const sess of activeSessions) {
        if (!seenSessionIds.has(sess.sessionId)) {
          seenSessionIds.add(sess.sessionId);
          candidateSessionIds.push(sess.sessionId);
        }
      }

      if (candidateSessionIds.length === 0) {
        return [];
      }

      // 2. ดึงรายละเอียด Sessions + Exercises ของ Candidate (จำกัด 30 รายการแรก) ใน Single Batch Query
      const targetQueryIds = candidateSessionIds.slice(0, 30);
      const sessions = await this.prisma.session.findMany({
        where: {
          sessionId: { in: targetQueryIds },
          status: 'active',
        },
        include: {
          sessionExercises: {
            where: { exercise: { status: 'active' } },
            orderBy: { sequenceOrder: 'asc' },
            include: { exercise: true },
          },
        },
      });

      const sessionMap = new Map(sessions.map((s) => [s.sessionId, s]));

      // 3. รวบรวม Exercise IDs ทั้งหมดที่เกี่ยวข้อง เพื่อดึงสถานะผ่านของผู้เรียนใน Single Batch Query
      const allExerciseIds = Array.from(
        new Set(
          sessions.flatMap((s) =>
            (s.sessionExercises || []).map((se) => se.exerciseId),
          ),
        ),
      );

      let passedExerciseIdSet = new Set<number>();
      if (allExerciseIds.length > 0) {
        const passedActivities = await this.prisma.activity.findMany({
          where: {
            userId,
            exerciseId: { in: allExerciseIds },
            score: { gte: 80 },
          },
          select: { exerciseId: true },
          distinct: ['exerciseId'],
        });
        passedExerciseIdSet = new Set(
          passedActivities.map((a) => a.exerciseId),
        );
      }

      // 4. ประมวลผลและคัดเลือก 3 Session ที่ยังทำไม่เสร็จ (Incomplete) ใน Memory
      const result = [];
      for (const sessId of targetQueryIds) {
        const session = sessionMap.get(sessId);
        if (!session) continue;

        const sessionExercises = session.sessionExercises || [];
        if (sessionExercises.length === 0) continue;

        const exercises = sessionExercises.map((se, idx) => {
          const isPassed = passedExerciseIdSet.has(se.exerciseId);
          return {
            exerciseId: se.exerciseId,
            orderNumber: idx + 1,
            title: se.exercise?.title || '',
            description: se.exercise?.description || '',
            expectedTime: se.exercise?.expectedTime || 5,
            isPassed,
          };
        });

        const completedCount = exercises.filter((e) => e.isPassed).length;
        const isCompleted = completedCount === exercises.length;

        // ดึงเฉพาะ Session ที่ผู้เรียนยังทำไม่ครบทุกข้อ
        if (!isCompleted) {
          const totalExpectedTime = exercises.reduce(
            (sum, e) => sum + e.expectedTime,
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

          if (result.length >= 3) {
            break;
          }
        }
      }

      return result;
    } catch (err: unknown) {
      this.logger.error(
        'Error in getRecentSession:',
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async getDashboardStats(userId: number, roleId?: number) {
    try {
      // 1. ดึงรายการโจทย์ที่ไม่ซ้ำซึ่งผูกอยู่ใน Session ที่เปิดใช้งาน (status: 'active')
      const inSessionExercises = await this.prisma.sessionExercise.findMany({
        where: {
          session: { status: 'active' },
          exercise: { status: 'active' },
        },
        select: { exerciseId: true },
        distinct: ['exerciseId'],
      });

      const inSessionExerciseIds = inSessionExercises.map((se) => se.exerciseId);
      const inSessionCount = inSessionExerciseIds.length;

      // 2. ดึงจำนวนโจทย์ active ทั้งหมดในระบบ (ใช้สำหรับมุมมอง Admin)
      const totalSystemExercises = await this.prisma.exercise.count({
        where: { status: 'active' },
      });

      // หากเป็น Admin (roleId === 3) ให้นับจำนวนโจทย์ทั้งหมดในระบบ
      // สำหรับผู้เรียน (Student) หรือบทบาททั่วไป ให้นับเฉพาะโจทย์ใน Session ที่เปิดสอนจริง
      const totalExercises =
        roleId === 3 ? totalSystemExercises : inSessionCount;

      // 3. นับจำนวนโจทย์ใน Session ที่ผู้เรียนทำคะแนนผ่านเกณฑ์ (>= 80 คะแนน)
      let completedExercises = 0;
      if (inSessionExerciseIds.length > 0) {
        const completedActivities = await this.prisma.activity.findMany({
          where: {
            userId,
            exerciseId: { in: inSessionExerciseIds },
            score: { gte: 80 },
          },
          select: { exerciseId: true },
          distinct: ['exerciseId'],
        });
        completedExercises = Math.min(
          completedActivities.length,
          totalExercises,
        );
      }

      // 4. คำนวณคะแนนเฉลี่ยจากการส่งตรวจ (Submit) ของโจทย์ในหลักสูตร
      const submissions = await this.prisma.activity.aggregate({
        where: {
          userId,
          eventType: 'submit',
          ...(inSessionExerciseIds.length > 0
            ? { exerciseId: { in: inSessionExerciseIds } }
            : {}),
        },
        _avg: { score: true },
      });
      const averageScore = Math.round(submissions._avg.score || 0);

      return {
        totalExercises,
        completedExercises,
        averageScore,
        totalSystemExercises,
        inSessionExercisesCount: inSessionCount,
      };
    } catch (err: unknown) {
      this.logger.error(
        'Error in getDashboardStats:',
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }

  async getHistory(userId: number, limit?: number, page: number = 1) {
    try {
      if (limit === undefined) {
        return await this.prisma.activity.findMany({
          where: {
            userId,
            eventType: { in: ['run', 'submit'] },
          },
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
          where: {
            userId,
            eventType: { in: ['run', 'submit'] },
          },
          orderBy: { submittedAt: 'desc' },
          take: limit,
          skip,
          include: {
            exercise: true,
            session: true,
          },
        }),
        this.prisma.activity.count({
          where: {
            userId,
            eventType: { in: ['run', 'submit'] },
          },
        }),
      ]);

      return {
        item,
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      };
    } catch (err: unknown) {
      this.logger.error(
        'Error in getHistory:',
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    }
  }
}
