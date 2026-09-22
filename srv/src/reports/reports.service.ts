import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}
  private getThaiDateTime(date: Date | string) {
    const d = new Date(date);
    const thaiTime = new Date(d.getTime() + 7 * 60 * 60 * 1000);
    return {
      hours: thaiTime.getUTCHours(),
      dayOfWeek: thaiTime.getUTCDay(), // 0 = อาทิตย์, 1 = จันทร์, ...
      dayOfMonth: thaiTime.getUTCDate(), // วันที่ 1 - 31
      month: thaiTime.getUTCMonth(), // เดือน 0 (ม.ค.) - 11 (ธ.ค.)
      year: thaiTime.getUTCFullYear(),
    };
  }

  private getTimeRangeDates(
    timeRange?: string,
    startDate?: string,
    endDate?: string,
  ) {
    const MS_7_HOURS = 7 * 60 * 60 * 1000;

    if (startDate || endDate) {
      let start: Date | undefined = undefined;
      let end: Date | undefined = undefined;

      if (startDate) {
        const parts = startDate.split('-').map(Number);
        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
          start = new Date(
            Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0) - MS_7_HOURS,
          );
        } else {
          start = new Date(startDate);
        }
      }

      if (endDate) {
        const parts = endDate.split('-').map(Number);
        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
          end = new Date(
            Date.UTC(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999) -
              MS_7_HOURS,
          );
        } else {
          const ed = new Date(endDate);
          ed.setHours(23, 59, 59, 999);
          end = ed;
        }
      }

      return { start, end };
    }
    if (!timeRange) return { start: undefined, end: undefined };

    // คำนวณวันปัจจุบันตามเวลาประเทศไทย (UTC+7)
    const nowUtc = new Date();
    const nowThai = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000);
    const year = nowThai.getUTCFullYear();
    const month = nowThai.getUTCMonth();
    const date = nowThai.getUTCDate();
    const day = nowThai.getUTCDay();

    if (timeRange === 'daily') {
      // เวลาไทย 00:00:00.000 ถึง 23:59:59.999 ของวันนี้
      const start = new Date(
        Date.UTC(year, month, date, 0, 0, 0, 0) - MS_7_HOURS,
      );
      const end = new Date(
        Date.UTC(year, month, date, 23, 59, 59, 999) - MS_7_HOURS,
      );
      return { start, end };
    } else if (timeRange === 'weekly') {
      // วันจันทร์ (00:00:00) ถึงวันอาทิตย์ (23:59:59) ของสัปดาห์ปัจจุบันในไทย
      const diffToMon = day === 0 ? -6 : 1 - day;
      const mondayDate = date + diffToMon;
      const start = new Date(
        Date.UTC(year, month, mondayDate, 0, 0, 0, 0) - MS_7_HOURS,
      );
      const end = new Date(
        Date.UTC(year, month, mondayDate + 6, 23, 59, 59, 999) - MS_7_HOURS,
      );
      return { start, end };
    } else if (timeRange === 'monthly') {
      // วันที่ 1 ถึงวันสิ้นเดือนของเดือนปัจจุบันในไทย
      const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0) - MS_7_HOURS);
      const end = new Date(
        Date.UTC(year, month + 1, 0, 23, 59, 59, 999) - MS_7_HOURS,
      );
      return { start, end };
    } else if (timeRange === 'yearly') {
      // วันที่ 1 ม.ค. ถึง 31 ธ.ค. ของปีปัจจุบันในไทย
      const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0) - MS_7_HOURS);
      const end = new Date(
        Date.UTC(year, 11, 31, 23, 59, 59, 999) - MS_7_HOURS,
      );
      return { start, end };
    }

    return { start: undefined, end: undefined };
  }

  async getStudentReport(filters: {
    startDate?: string;
    endDate?: string;
    education?: string;
    search?: string;
    timeRange?: string;
  }) {
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

    const dateRange = this.getTimeRangeDates(
      filters.timeRange,
      filters.startDate,
      filters.endDate,
    );

    // ดึงข้อมูลผู้เรียนทั้งหมด พร้อมกิจกรรม (activities) ที่กรองตามช่วงเวลา (dateRange)
    const students = await this.prisma.userProfile.findMany({
      where,
      include: {
        education: true,
        userSessions: true,
        activities: {
          where: {
            status: { not: 'PENDING' },
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
            exerciseId: true,
            score: true,
            runCount: true,
            eventType: true,
            createdAt: true,
          },
        },
      },
    });

    const totalExercises = await this.prisma.exercise.count({
      where: { status: 'active' },
    });

    const totalSessions = await this.prisma.session.count();

    return students.map((student) => {
      // กรองเฉพาะกิจกรรมที่เป็นการส่งตรวจ (Submit) เพื่อวัดผลสัมฤทธิ์จริงของแบบฝึกหัด
      // โดยไม่นำการทดลองรันโค้ด (Run Code) ระหว่างฝึกฝนมาปะปนกับผลการประเมิน
      const submitActivities = student.activities.filter(
        (a) => a.eventType === 'submit',
      );
      const totalSubmissions = submitActivities.length;
      const passedSubmissions = submitActivities.filter(
        (a) => a.score >= 80,
      ).length;

      // คำนวณจำนวนโจทย์ที่ไม่ซ้ำที่ส่งตรวจผ่านเกณฑ์ (>= 80 คะแนน)
      const passedExerciseSet = new Set(
        submitActivities
          .filter((a) => a.score >= 80)
          .map((a) => a.exerciseId),
      );
      const passedExercises = passedExerciseSet.size;

      // รวมคะแนนที่ดีที่สุดในแต่ละแบบฝึกหัดที่ผู้เรียน "ส่งตรวจ" (Best score per submitted exercise)
      // ป้องกัน Bug: ต้องตรวจสอบ !bestScoreMap.has(act.exerciseId) เพื่อให้บันทึกข้อที่ส่งตรวจแล้วได้ 0 คะแนนด้วย
      // ป้องกันไม่ให้ข้อที่ได้ 0 คะแนนหลุดออกจากตัวหารจนคะแนนเฉลี่ยสูงเกินจริง
      const bestScoreMap = new Map<number, number>();
      for (const act of submitActivities) {
        if (
          !bestScoreMap.has(act.exerciseId) ||
          act.score > (bestScoreMap.get(act.exerciseId) ?? 0)
        ) {
          bestScoreMap.set(act.exerciseId, act.score);
        }
      }
      const bestScores = Array.from(bestScoreMap.values());
      const averageScore =
        bestScores.length > 0
          ? bestScores.reduce((sum, s) => sum + s, 0) / bestScores.length
          : 0;

      // คำนวณจำนวนครั้งที่รันโค้ดเฉลี่ยต่อการส่งตรวจแต่ละครั้ง
      const runs = submitActivities.map((a) => a.runCount);
      const averageAttempts =
        runs.length > 0 ? runs.reduce((sum, r) => sum + r, 0) / runs.length : 0;

      return {
        userId: student.userId,
        username: student.username,
        fullName: `${student.firstName} ${student.lastName}`,
        university: student.education?.university || '-',
        faculty: student.education?.faculty || '-',
        passedExercises, // จำนวนโจทย์ที่ผ่านจริงจากการส่งตรวจ
        totalExercises, // จำนวนโจทย์ทั้งหมดในระบบ
        completedSessions: passedExercises, // รองรับกรณีโค้ดเก่าเรียกใช้
        totalSessions: totalExercises,
        totalSubmissions,
        passedSubmissions,
        averageScore,
        averageAttempts,
        lastActiveAt: student.lastActiveAt,
      };
    });
  }

  // ดึงประวัติกิจกรรมทั้งหมดของผู้เรียนรายบุคคล พร้อมข้อมูลโปรไฟล์, จำนวนโจทย์ทั้งหมด และ AI Feedback
  async getStudentActivities(userId: number) {
    const student = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { education: true },
    });

    const activities = await this.prisma.activity.findMany({
      where: { userId },
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

    const totalExercises = await this.prisma.exercise.count({
      where: { status: 'active' },
    });

    // คำนวณสถิติภาพรวมของผู้เรียนคนนี้ที่ Backend (Single Source of Truth)
    // โดยคิดผลการประเมินจากกิจกรรม Submit และบันทึกข้อที่ได้ 0 คะแนนเข้าตัวหารอย่างถูกต้อง
    const submitActivities = activities.filter((a) => a.eventType === 'submit');
    const runActivities = activities.filter((a) => a.eventType === 'run');

    const passedExerciseSet = new Set(
      submitActivities
        .filter((a) => a.score >= 80)
        .map((a) => a.exerciseId),
    );
    const passedCount = passedExerciseSet.size;
    const percentage =
      totalExercises > 0 ? (passedCount / totalExercises) * 100 : 0;

    const bestScoreMap = new Map<number, number>();
    for (const act of submitActivities) {
      if (
        !bestScoreMap.has(act.exerciseId) ||
        act.score > (bestScoreMap.get(act.exerciseId) ?? 0)
      ) {
        bestScoreMap.set(act.exerciseId, act.score);
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
            lastActiveAt: student.lastActiveAt,
          }
        : null,
      totalExercises,
      stats,
      activities,
    };
  }

  // ดึงรายงานสถิติของแบบฝึกหัดทั้งหมด พร้อมคำนวณสถิติผู้เข้าทำและอัตราผ่านรายบุคคล (Unique Students)
  async getExerciseReport(filters: {
    startDate?: string;
    endDate?: string;
    education?: string;
    search?: string;
    timeRange?: string;
  }) {
    const dateRange = this.getTimeRangeDates(
      filters.timeRange,
      filters.startDate,
      filters.endDate,
    );

    // 1. นับจำนวนนักศึกษาทั้งหมดในระบบ (หรือตามตัวกรองสถาบัน) เพื่อใช้เป็นตัวหารของ Overall Pass Rate
    const totalStudents = await this.prisma.userProfile.count({
      where: {
        roleId: 1, // เฉพาะนักศึกษา
        education: filters.education
          ? {
              OR: [
                { university: { contains: filters.education, mode: 'insensitive' } },
                { faculty: { contains: filters.education, mode: 'insensitive' } },
              ],
            }
          : undefined,
      },
    });

    // 2. ดึงข้อมูลโจทย์พร้อมกิจกรรม (Activities) โดยกรองตามชื่อโจทย์หรือหัวข้อหากมีคำค้นหา
    const exercises = await this.prisma.exercise.findMany({
      where: filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: 'insensitive' } },
              { topic: { contains: filters.search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        activities: {
          where: {
            user: filters.education
              ? {
                  education: {
                    OR: [
                      { university: { contains: filters.education, mode: 'insensitive' } },
                      { faculty: { contains: filters.education, mode: 'insensitive' } },
                    ],
                  },
                }
              : undefined,
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
      const submitActivities = ex.activities.filter((a) => a.eventType === 'submit');
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
      const attemptedUserIds = Array.from(new Set(ex.activities.map((a) => a.userId)));
      const attemptedStudents = attemptedUserIds.length;

      // จำนวนนักศึกษาที่ทำผ่านเกณฑ์ (>= 80 คะแนน)
      let passedStudents = 0;
      userBestScoreMap.forEach((score) => {
        if (score >= 80) passedStudents += 1;
      });

      // อัตราการผ่านคิดจากคนที่เข้าทำ (Pass Rate among Attempted)
      const passRateAttempted = attemptedStudents > 0 ? (passedStudents / attemptedStudents) * 100 : 0;

      // อัตราการผ่านคิดจากนักศึกษาทั้งหมดในระบบ (Overall Pass Rate)
      const passRateOverall = totalStudents > 0 ? (passedStudents / totalStudents) * 100 : 0;

      // ค่าเฉลี่ยจำนวนครั้ง Run และ Submit ต่อคนที่เข้าทำ
      const totalRuns = runActivities.length;
      const totalSubmits = submitActivities.length;
      const avgRuns = attemptedStudents > 0 ? totalRuns / attemptedStudents : 0;
      const avgSubmits = attemptedStudents > 0 ? totalSubmits / attemptedStudents : 0;

      // อัตราการขอคำใบ้
      const hintUsedCount = ex.activities.filter((a) => a.hintUsed).length;
      const hintUsageRate = ex.activities.length > 0 ? (hintUsedCount / ex.activities.length) * 100 : 0;

      // เวลาเฉลี่ยที่ใช้จริง (นาที)
      // ป้องกัน Outlier ข้ามวัน: กรองเฉพาะช่วงเวลาที่ทำต่อเนื่องจริง (ไม่เกิน 120 นาที) เพื่อไม่ให้ค่าเฉลี่ยเพี้ยนจากคนที่เปิดจอทิ้งไว้
      const rawTimes = submitActivities
        .filter((a) => a.startedAt && a.submittedAt)
        .map((a) => Math.max(0, (new Date(a.submittedAt).getTime() - new Date(a.startedAt).getTime()) / (1000 * 60)));

      const realisticTimes = rawTimes.filter((t) => t <= 120);
      const timesToAverage = realisticTimes.length > 0 
        ? realisticTimes 
        : rawTimes.map((t) => Math.min(t, Math.max((ex.expectedTime || 10) * 3, 60)));

      const avgTimeSpentMinutes = timesToAverage.length > 0
        ? timesToAverage.reduce((s, t) => s + t, 0) / timesToAverage.length
        : 0;

      return {
        exerciseId: ex.exerciseId,
        title: ex.title,
        topic: ex.topic,
        difficultyLevel: ex.difficultyLevel,
        attemptedStudents,
        totalStudents,
        passedStudents,
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

  // ดึงรายละเอียดผลงานของนักศึกษารายคนสำหรับโจทย์ข้อที่ระบุ (Drill-Down)
  async getExerciseStudentBreakdown(exerciseId: number, filters?: { education?: string }) {
    // 1. ดึงรายละเอียดโจทย์
    const exercise = await this.prisma.exercise.findUnique({
      where: { exerciseId },
    });
    if (!exercise) {
      throw new Error('ไม่พบข้อมูลแบบฝึกหัดที่ระบุ');
    }

    // 2. ดึงนักศึกษาทั้งหมดในระบบ (หรือกรองตามสถาบัน)
    const students = await this.prisma.userProfile.findMany({
      where: {
        roleId: 1, // เฉพาะนักศึกษา
        education: filters?.education
          ? {
              OR: [
                { university: { contains: filters.education, mode: 'insensitive' } },
                { faculty: { contains: filters.education, mode: 'insensitive' } },
              ],
            }
          : undefined,
      },
      include: {
        education: true,
        activities: {
          where: { exerciseId },
          orderBy: { submittedAt: 'desc' },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    // 3. รวบรวมสถิติรายบุคคล
    let totalRunsSum = 0;
    let totalSubmitsSum = 0;
    let passedCount = 0;
    let attemptedCount = 0;
    let bestScoreSum = 0;

    const studentList = students.map((student) => {
      const acts = student.activities;
      const submits = acts.filter((a) => a.eventType === 'submit');
      const runs = acts.filter((a) => a.eventType === 'run');

      const isAttempted = acts.length > 0;
      if (isAttempted) attemptedCount += 1;

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

      const latestSubmit = submits[0] || acts[0] || null;

      return {
        userId: student.userId,
        username: student.username,
        fullName: `${student.firstName} ${student.lastName}`.trim(),
        university: student.education?.university || '-',
        faculty: student.education?.faculty || '-',
        isAttempted,
        status: !isAttempted ? 'NOT_STARTED' : isPassed ? 'PASSED' : 'FAILED',
        bestScore: hasSubmit ? bestScore : null,
        runCount: runs.length,
        submitCount: submits.length,
        totalAttempts: acts.length,
        lastSubmittedAt: latestSubmit ? latestSubmit.submittedAt : null,
        latestActivity: latestSubmit
          ? {
              activityId: latestSubmit.activityId,
              userId: student.userId,
              exerciseId: exercise.exerciseId,
              sessionId: latestSubmit.sessionId,
              startedAt: latestSubmit.startedAt,
              submittedAt: latestSubmit.submittedAt,
              hintUsed: latestSubmit.hintUsed,
              score: latestSubmit.score,
              status: latestSubmit.status,
              answer: latestSubmit.answer,
              output: latestSubmit.output,
              exceptionMessage: latestSubmit.exceptionMessage,
              aiFeedback: latestSubmit.aiFeedback,
              eventType: latestSubmit.eventType,
              runCount: latestSubmit.runCount,
            }
          : null,
      };
    });

    const totalStudents = students.length;
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
        totalStudents,
        attemptedCount,
        passedCount,
        passRateAttempted: attemptedCount > 0 ? (passedCount / attemptedCount) * 100 : 0,
        passRateOverall: totalStudents > 0 ? (passedCount / totalStudents) * 100 : 0,
        totalRuns: totalRunsSum,
        totalSubmits: totalSubmitsSum,
        avgRuns: attemptedCount > 0 ? totalRunsSum / attemptedCount : 0,
        avgSubmits: attemptedCount > 0 ? totalSubmitsSum / attemptedCount : 0,
        avgScore,
      },
      students: studentList,
    };
  }

  async getErrorReport(filter: {
    startDate?: string;
    endDate?: string;
    education?: string;
    search?: string;
    timeRange?: string;
  }) {
    const where: any = {
      eventType: 'run',
      exceptionMessage: { not: null },
    };

    if (filter.search) {
      where.exceptionMessage = {
        contains: filter.search,
        mode: 'insensitive',
      };
    }

    if (filter.education) {
      where.user = {
        education: {
          OR: [
            { university: { contains: filter.education, mode: 'insensitive' } },
            { faculty: { contains: filter.education, mode: 'insensitive' } },
          ],
        },
      };
    }

    const dateRange = this.getTimeRangeDates(
      filter.timeRange,
      filter.startDate,
      filter.endDate,
    );
    if (dateRange.start || dateRange.end) {
      where.createdAt = {};
      if (dateRange.start) where.createdAt.gte = dateRange.start;
      if (dateRange.end) where.createdAt.lte = dateRange.end;
    }

    const activitiesWithError = await this.prisma.activity.findMany({
      where,
      select: { exceptionMessage: true },
    });

    const totalErrors = activitiesWithError.length;
    if (totalErrors === 0) return [];

    const errorMap = new Map<string, { count: number; examples: string[] }>();

    activitiesWithError.forEach((act) => {
      const msg = act.exceptionMessage || '';
      let errorType = 'RuntimeError';

      const match = msg.match(/^([a-zA-Z]+Error):/);
      if (match) {
        errorType = match[1];
      } else if (msg.includes('SyntaxError')) {
        errorType = 'SyntaxError';
      } else if (msg.includes('IndentationError')) {
        errorType = 'IndentationError';
      } else if (msg.includes('NameError')) {
        errorType = 'NameError';
      } else if (msg.includes('TypeError')) {
        errorType = 'TypeError';
      }

      if (!errorMap.has(errorType)) {
        errorMap.set(errorType, { count: 0, examples: [] });
      }
      const item = errorMap.get(errorType)!;
      item.count++;
      if (item.examples.length < 3) {
        item.examples.push(msg);
      }
    });

    return Array.from(errorMap.entries())
      .map(([type, data]) => ({
        errorType: type,
        occurrenceCount: data.count,
        percentage: (data.count / totalErrors) * 100,
        commonExceptionMessage: data.examples[0] || '',
      }))
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  }

  async getUsageAnalytics(filters: { startDate?: string; endDate?: string }) {
    const dateRange = this.getTimeRangeDates(
      undefined,
      filters.startDate,
      filters.endDate,
    );

    const dateWhere =
      dateRange.start || dateRange.end
        ? {
            createdAt: {
              gte: dateRange.start,
              lte: dateRange.end,
            },
          }
        : undefined;

    // ดึงเฉพาะประวัติการเข้าสู่ระบบ (LOGIN) จากตาราง AuditLog ของวันที่เลือก
    const auditLogs = await this.prisma.auditLog.findMany({
      where: {
        ...dateWhere,
        action: 'LOGIN',
      },
      select: { createdAt: true },
    });

    // จัดกลุ่มตามช่วงเวลา 4 ชั่วโมงต่อ Slot (อิงตามชั่วโมงเวลาไทย Asia/Bangkok)
    const slots = [0, 0, 0, 0, 0, 0];
    auditLogs.forEach((l) => {
      const thai = this.getThaiDateTime(l.createdAt);
      const slotIndex = Math.min(Math.floor(thai.hours / 4), 5);
      slots[slotIndex]++;
    });

    return [
      { periodLabel: '00:00 - 03:59', userCount: slots[0] },
      { periodLabel: '04:00 - 07:59', userCount: slots[1] },
      { periodLabel: '08:00 - 11:59', userCount: slots[2] },
      { periodLabel: '12:00 - 15:59', userCount: slots[3] },
      { periodLabel: '16:00 - 19:59', userCount: slots[4] },
      { periodLabel: '20:00 - 23:59', userCount: slots[5] },
    ];
  }
}
