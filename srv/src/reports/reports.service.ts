import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getTimeRangeDates } from './utils/thai-date.util';

export interface StudentReportFilter {
  startDate?: string;
  endDate?: string;
  education?: string;
  search?: string;
  timeRange?: string;
}

export interface ExerciseReportFilter {
  startDate?: string;
  endDate?: string;
  education?: string;
  search?: string;
  timeRange?: string;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStudentReport(filters: StudentReportFilter) {
    const where: any = {
      roleId: 1, // ค้นหาเฉพาะผู้เรียนที่เป็น Student
    };

    if (filters.search) {
      where.OR = [
        { username: { contains: filters.search, mode: 'insensitive' } },
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.education) {
      where.education = {
        OR: [
          { university: { contains: filters.education, mode: 'insensitive' } },
          { faculty: { contains: filters.education, mode: 'insensitive' } },
        ],
      };
    }

    const dateRange = getTimeRangeDates(
      filters.timeRange,
      filters.startDate,
      filters.endDate,
    );

    // ดึงข้อมูลผู้เรียนทั้งหมด พร้อมกิจกรรม (activities) ที่กรองตามช่วงเวลา (dateRange)
    const students = await this.prisma.userProfile.findMany({
      where,
      include: {
        education: {
          select: {
            university: true,
            faculty: true,
          },
        },
        activities: {
          where: {
            status: { not: 'PENDING' },
            session: { status: 'active' },
            exercise: { status: 'active' },
            ...(dateRange.start || dateRange.end
              ? {
                  createdAt: {
                    gte: dateRange.start,
                    lte: dateRange.end,
                  },
                }
              : {}),
          },
          select: {
            sessionId: true,
            exerciseId: true,
            score: true,
            runCount: true,
            eventType: true,
            createdAt: true,
          },
        },
      },
    });

    // คำนวณจำนวนภาระงาน/โจทย์ทั้งหมดที่เปิดให้ทำใน Session และ Exercise ที่เปิดใช้งาน (status: 'active')
    const totalExercises = await this.prisma.sessionExercise.count({
      where: {
        session: { status: 'active' },
        exercise: { status: 'active' },
      },
    });

    return students.map((student) => {
      const submitActivities = student.activities.filter(
        (a) => a.eventType === 'submit',
      );
      const totalSubmissions = submitActivities.length;
      const passedSubmissions = submitActivities.filter(
        (a) => a.score >= 80,
      ).length;

      // คำนวณจำนวนภาระงานที่ผู้เรียนเริ่มเข้าทำจริง (จับคู่ Session + Exercise)
      const attemptedExerciseSet = new Set(
        student.activities.map((a) => `${a.sessionId}_${a.exerciseId}`),
      );
      const attemptedExercises = attemptedExerciseSet.size;

      // คำนวณจำนวนภาระงานที่ส่งตรวจผ่านเกณฑ์ (>= 80 คะแนน) ในแต่ละ Session
      const passedExerciseSet = new Set(
        submitActivities
          .filter((a) => a.score >= 80)
          .map((a) => `${a.sessionId}_${a.exerciseId}`),
      );
      const passedExercises = passedExerciseSet.size;

      // รวมคะแนนที่ดีที่สุดในแต่ละ Session-Exercise ที่ผู้เรียน "ส่งตรวจ"
      const bestScoreMap = new Map<string, number>();
      for (const act of submitActivities) {
        const key = `${act.sessionId}_${act.exerciseId}`;
        if (
          !bestScoreMap.has(key) ||
          act.score > (bestScoreMap.get(key) ?? 0)
        ) {
          bestScoreMap.set(key, act.score);
        }
      }
      const bestScores = Array.from(bestScoreMap.values());
      const averageScore =
        bestScores.length > 0
          ? bestScores.reduce((sum, s) => sum + s, 0) / bestScores.length
          : 0;

      // คำนวณจำนวนครั้งที่รันโค้ดทั้งหมด
      const runActivities = student.activities.filter(
        (a) => a.eventType === 'run',
      );
      const totalRuns = runActivities.length;

      // คำนวณจำนวนครั้งที่รันโค้ดเฉลี่ยต่อโจทย์ที่เข้าทำ
      const averageAttempts =
        attemptedExercises > 0
          ? Number((totalRuns / attemptedExercises).toFixed(1))
          : totalRuns;

      return {
        userId: student.userId,
        username: student.username,
        fullName: `${student.firstName} ${student.lastName}`,
        university: student.education?.university || '-',
        faculty: student.education?.faculty || '-',
        attemptedExercises,
        passedExercises,
        totalExercises,
        completedSessions: passedExercises,
        totalSessions: totalExercises,
        totalRuns,
        totalSubmissions,
        passedSubmissions,
        averageScore,
        averageAttempts,
      };
    });
  }

  async getStudentActivities(userId: number) {
    const student = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { education: true },
    });

    const activities = await this.prisma.activity.findMany({
      where: {
        userId,
        session: { status: 'active' },
        exercise: { status: 'active' },
        eventType: { in: ['run', 'submit'] },
      },
      orderBy: { submittedAt: 'desc' },
      include: {
        exercise: {
          select: {
            exerciseId: true,
            title: true,
            topic: true,
            difficultyLevel: true,
            expectedTime: true,
          },
        },
        session: {
          select: {
            sessionId: true,
            sessionName: true,
            targetLevel: true,
          },
        },
      },
    });

    const totalExercises = await this.prisma.sessionExercise.count({
      where: {
        session: { status: 'active' },
        exercise: { status: 'active' },
      },
    });

    const submitActivities = activities.filter((a) => a.eventType === 'submit');
    const runActivities = activities.filter((a) => a.eventType === 'run');

    const passedExerciseSet = new Set(
      submitActivities
        .filter((a) => a.score >= 80)
        .map((a) => `${a.sessionId}_${a.exerciseId}`),
    );
    const passedCount = passedExerciseSet.size;
    const percentage =
      totalExercises > 0 ? (passedCount / totalExercises) * 100 : 0;

    const bestScoreMap = new Map<string, number>();
    for (const act of submitActivities) {
      const key = `${act.sessionId}_${act.exerciseId}`;
      if (!bestScoreMap.has(key) || act.score > (bestScoreMap.get(key) ?? 0)) {
        bestScoreMap.set(key, act.score);
      }
    }
    const bestScores = Array.from(bestScoreMap.values());
    const averageScore =
      bestScores.length > 0
        ? bestScores.reduce((sum, s) => sum + s, 0) / bestScores.length
        : 0;

    const stats = {
      passedCount,
      percentage,
      averageScore,
      totalActivities: activities.length,
      submitCount: submitActivities.length,
      runCount: runActivities.length,
    };

    return {
      student: student
        ? {
            userId: student.userId,
            username: student.username,
            fullName: `${student.firstName} ${student.lastName}`,
            email: student.email,
            university: student.education?.university || '-',
            faculty: student.education?.faculty || '-',
            major: student.education?.major || '-',
          }
        : null,
      totalExercises,
      stats,
      activities,
    };
  }

  async getExerciseReport(filters: ExerciseReportFilter) {
    const dateRange = getTimeRangeDates(
      filters.timeRange,
      filters.startDate,
      filters.endDate,
    );

    // 1. นับจำนวนนักศึกษาที่มีการทำกิจกรรมจริงในระบบ
    const totalStudents = await this.prisma.userProfile.count({
      where: {
        roleId: 1, // เฉพาะนักศึกษา
        activities: {
          some: {
            eventType: { in: ['run', 'submit'] },
          },
        },
        education: filters.education
          ? {
              OR: [
                {
                  university: {
                    contains: filters.education,
                    mode: 'insensitive',
                  },
                },
                {
                  faculty: { contains: filters.education, mode: 'insensitive' },
                },
              ],
            }
          : undefined,
      },
    });

    // 2. ดึงเฉพาะโจทย์ที่มีนักศึกษาเข้าทำจริง (มีกิจกรรม run หรือ submit) เรียงตาม exerciseId จากน้อยไปมาก
    const exercises = await this.prisma.exercise.findMany({
      where: {
        ...(filters.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { topic: { contains: filters.search, mode: 'insensitive' } },
              ],
            }
          : {}),
        activities: {
          some: {
            user: {
              roleId: 1,
              ...(filters.education
                ? {
                    education: {
                      OR: [
                        {
                          university: {
                            contains: filters.education,
                            mode: 'insensitive',
                          },
                        },
                        {
                          faculty: {
                            contains: filters.education,
                            mode: 'insensitive',
                          },
                        },
                      ],
                    },
                  }
                : {}),
            },
            eventType: { in: ['run', 'submit'] },
            ...(dateRange.start || dateRange.end
              ? {
                  createdAt: {
                    gte: dateRange.start,
                    lte: dateRange.end,
                  },
                }
              : {}),
          },
        },
      },
      orderBy: { exerciseId: 'asc' },
      include: {
        activities: {
          where: {
            user: {
              roleId: 1,
              ...(filters.education
                ? {
                    education: {
                      OR: [
                        {
                          university: {
                            contains: filters.education,
                            mode: 'insensitive',
                          },
                        },
                        {
                          faculty: {
                            contains: filters.education,
                            mode: 'insensitive',
                          },
                        },
                      ],
                    },
                  }
                : {}),
            },
            createdAt:
              dateRange.start || dateRange.end
                ? {
                    gte: dateRange.start,
                    lte: dateRange.end,
                  }
                : undefined,
          },
          select: {
            userId: true,
            status: true,
            score: true,
            runCount: true,
            hintUsed: true,
            eventType: true,
            startedAt: true,
            submittedAt: true,
          },
        },
      },
    });

    return exercises.map((ex) => {
      const submitActivities = ex.activities.filter(
        (a) => a.eventType === 'submit',
      );
      const runActivities = ex.activities.filter((a) => a.eventType === 'run');

      // รวมคะแนนที่ดีที่สุดของนักศึกษาแต่ละคน (Unique User) เพื่อวัดผลสัมฤทธิ์ที่แท้จริง
      const userBestScoreMap = new Map<number, number>();
      for (const act of submitActivities) {
        const currentBest = userBestScoreMap.get(act.userId) ?? -1;
        if (act.score > currentBest) {
          userBestScoreMap.set(act.userId, act.score);
        }
      }

      // นับจำนวนนักศึกษาที่ไม่ซ้ำที่เข้าทำโจทย์ข้อนี้
      const attemptedUserIds = Array.from(
        new Set(ex.activities.map((a) => a.userId)),
      );
      const attemptedStudents = attemptedUserIds.length;

      // จำนวนนักศึกษาที่ทำผ่านเกณฑ์ (>= 80 คะแนน)
      let passedStudents = 0;
      userBestScoreMap.forEach((score) => {
        if (score >= 80) passedStudents += 1;
      });

      // อัตราการผ่านคิดจากคนที่เข้าทำ (Pass Rate among Attempted)
      const passRateAttempted =
        attemptedStudents > 0 ? (passedStudents / attemptedStudents) * 100 : 0;

      // อัตราการผ่านคิดจากนักศึกษาทั้งหมดในระบบ (Overall Pass Rate)
      const passRateOverall =
        totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0;

      // คะแนนเฉลี่ยของนักศึกษาที่เข้าทำโจทย์ข้อนี้ (คำนวณจากคะแนนที่ดีที่สุดของแต่ละคน)
      let totalBestScoreSum = 0;
      userBestScoreMap.forEach((score) => {
        totalBestScoreSum += score;
      });
      const avgScore =
        attemptedStudents > 0 ? totalBestScoreSum / attemptedStudents : 0;

      // ค่าเฉลี่ยจำนวนครั้ง Run และ Submit ต่อคนที่เข้าทำ
      const totalRuns = runActivities.length;
      const totalSubmits = submitActivities.length;
      const avgRuns = attemptedStudents > 0 ? totalRuns / attemptedStudents : 0;
      const avgSubmits =
        attemptedStudents > 0 ? totalSubmits / attemptedStudents : 0;

      // อัตราการขอคำใบ้ (คำนวณจากจำนวนนักศึกษาที่ไม่ซ้ำที่เปิดใช้คำใบ้)
      const hintUsedUserIds = new Set(
        ex.activities.filter((a) => a.hintUsed).map((a) => a.userId),
      );
      const hintUsedCount = hintUsedUserIds.size;
      const hintUsageRate =
        attemptedStudents > 0
          ? (hintUsedCount / attemptedStudents) * 100
          : 0;

      // เวลาเฉลี่ยที่ใช้จริง (นาที) กรองเฉพาะช่วงเวลาที่ทำต่อเนื่องจริง (ไม่เกิน 120 นาที)
      const rawTimes = submitActivities
        .filter((a) => a.startedAt && a.submittedAt)
        .map((a) =>
          Math.max(
            0,
            (new Date(a.submittedAt).getTime() -
              new Date(a.startedAt).getTime()) /
              (1000 * 60),
          ),
        );

      const realisticTimes = rawTimes.filter((t) => t <= 120);
      const timesToAverage =
        realisticTimes.length > 0
          ? realisticTimes
          : rawTimes.map((t) =>
              Math.min(t, Math.max((ex.expectedTime || 10) * 3, 60)),
            );

      const avgTimeSpentMinutes =
        timesToAverage.length > 0
          ? timesToAverage.reduce((s, t) => s + t, 0) / timesToAverage.length
          : 0;

      return {
        exerciseId: ex.exerciseId,
        title: ex.title,
        topic: ex.topic,
        difficultyLevel: ex.difficultyLevel,
        status: ex.status,
        attemptedStudents,
        totalStudents,
        passedStudents,
        avgScore,
        successRate: passRateAttempted,
        passRateAttempted,
        passRateOverall,
        averageAttempts: avgRuns,
        avgRuns,
        avgSubmits,
        totalRuns,
        totalSubmits,
        hintUsageRate,
        avgTimeSpentMinutes,
        expectedTimeMinutes: ex.expectedTime,
      };
    });
  }

  async getExerciseStudentBreakdown(
    exerciseId: number,
    filters?: { education?: string },
  ) {
    // 1. ดึงรายละเอียดโจทย์
    const exercise = await this.prisma.exercise.findUnique({
      where: { exerciseId },
    });
    if (!exercise) {
      throw new Error('ไม่พบข้อมูลแบบฝึกหัดที่ระบุ');
    }

    // 2. ดึงเฉพาะนักศึกษาที่มีประวัติการทำโจทย์ข้อนี้จริง
    const students = await this.prisma.userProfile.findMany({
      where: {
        roleId: 1, // เฉพาะนักศึกษา
        activities: {
          some: {
            exerciseId,
            eventType: { in: ['run', 'submit', 'hint'] },
          },
        },
        education: filters?.education
          ? {
              OR: [
                {
                  university: {
                    contains: filters.education,
                    mode: 'insensitive',
                  },
                },
                {
                  faculty: { contains: filters.education, mode: 'insensitive' },
                },
              ],
            }
          : undefined,
      },
      include: {
        education: true,
        activities: {
          where: {
            exerciseId,
            eventType: { in: ['run', 'submit', 'hint'] },
          },
          orderBy: { submittedAt: 'desc' },
        },
      },
      // เรียงลำดับนักศึกษาตาม userId จากน้อยไปมากเป็นค่าเริ่มต้น เพื่อความสะดวกในการตรวจเช็คและเทียบข้อมูลทะเบียน
      orderBy: { userId: 'asc' },
    });

    // 3. รวบรวมสถิติรายบุคคลเฉพาะผู้ที่เข้าทำจริง
    let totalRunsSum = 0;
    let totalSubmitsSum = 0;
    let passedCount = 0;
    let attemptedCount = 0;
    let bestScoreSum = 0;
    let hintUsedStudentsCount = 0;

    const studentList = students.map((student) => {
      const acts = student.activities;
      const submits = acts.filter((a) => a.eventType === 'submit');
      const runs = acts.filter((a) => a.eventType === 'run');

      const isAttempted = acts.length > 0;
      if (isAttempted) attemptedCount += 1;

      // ตรวจสอบว่าผู้เรียนเคยเปิดดูคำใบ้ (Hint) ในโจทย์ข้อนี้หรือไม่
      const hasUsedHint = acts.some((a) => a.hintUsed === true);
      if (hasUsedHint) hintUsedStudentsCount += 1;

      let bestScore = 0;
      const hasSubmit = submits.length > 0;
      if (hasSubmit) {
        bestScore = Math.max(...submits.map((s) => s.score));
        bestScoreSum += bestScore;
      }

      const isPassed = bestScore >= 80;
      if (isPassed) passedCount += 1;

      totalRunsSum += runs.length;
      totalSubmitsSum += submits.length;

      // ค้นหารอบที่ทำได้คะแนนสูงสุด (Best Submit) เพื่อให้ผลการตรวจโค้ดตรงกับคะแนนสูงสุด 100 ในตาราง
      // หากยังไม่เคย Submit (รันอย่างเดียว) ให้ดึงรอบกิจกรรมรันล่าสุด (หลีกเลี่ยงกิจกรรมประเภท hint)
      const bestSubmit = hasSubmit
        ? submits.find((s) => s.score === bestScore) || submits[0]
        : runs[0] || null;

      return {
        userId: student.userId,
        username: student.username,
        fullName: `${student.firstName} ${student.lastName}`.trim(),
        university: student.education?.university || '-',
        faculty: student.education?.faculty || '-',
        isAttempted: true,
        status: isPassed ? 'PASSED' : hasSubmit ? 'FAILED' : 'NOT_SUBMITTED',
        bestScore: hasSubmit ? bestScore : null,
        hasUsedHint,
        runCount: runs.length,
        submitCount: submits.length,
        totalAttempts: runs.length + submits.length,
        lastSubmittedAt:
          hasSubmit && submits[0] ? submits[0].submittedAt : null,
        latestActivity: bestSubmit
          ? {
              activityId: bestSubmit.activityId,
              userId: student.userId,
              exerciseId: exercise.exerciseId,
              sessionId: bestSubmit.sessionId,
              startedAt: bestSubmit.startedAt,
              submittedAt: bestSubmit.submittedAt,
              hintUsed: hasUsedHint || Boolean(bestSubmit.hintUsed),
              score: bestSubmit.score,
              status: bestSubmit.status,
              answer: bestSubmit.answer,
              output: bestSubmit.output,
              exceptionMessage: bestSubmit.exceptionMessage,
              aiFeedback: bestSubmit.aiFeedback,
              eventType: bestSubmit.eventType,
              runCount: bestSubmit.runCount,
            }
          : null,
      };
    });

    const avgScore = attemptedCount > 0 ? bestScoreSum / attemptedCount : 0;

    return {
      exercise: {
        exerciseId: exercise.exerciseId,
        title: exercise.title,
        topic: exercise.topic,
        objective: exercise.objective,
        difficultyLevel: exercise.difficultyLevel,
        expectedTime: exercise.expectedTime,
        hint: exercise.hint,
      },
      stats: {
        totalStudents: attemptedCount,
        attemptedCount,
        passedCount,
        passRateAttempted:
          attemptedCount > 0 ? (passedCount / attemptedCount) * 100 : 0,
        passRateOverall:
          attemptedCount > 0 ? (passedCount / attemptedCount) * 100 : 0,
        totalRuns: totalRunsSum,
        totalSubmits: totalSubmitsSum,
        avgRuns: attemptedCount > 0 ? totalRunsSum / attemptedCount : 0,
        avgSubmits: attemptedCount > 0 ? totalSubmitsSum / attemptedCount : 0,
        avgScore,
        hintUsedCount: hintUsedStudentsCount,
        hintUsageRate:
          attemptedCount > 0
            ? (hintUsedStudentsCount / attemptedCount) * 100
            : 0,
      },
      students: studentList,
    };
  }
}
