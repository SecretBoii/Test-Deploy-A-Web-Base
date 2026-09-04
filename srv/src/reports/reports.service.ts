import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private getTimeRangeDates(timeRange?: string, startDate?: string, endDate?: string) {
    if (startDate || endDate) {
      return {
        start: startDate ? new Date(startDate) : undefined,
        end: endDate ? (() => { const d = new Date(endDate); d.setHours(23, 59, 59, 999); return d; })() : undefined,
      };
    }
    if (!timeRange) return { start: undefined, end: undefined };

    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const start = new Date(now);
    if (timeRange === 'daily') {
      start.setHours(0, 0, 0, 0);
    } else if (timeRange === 'weekly') {
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else if (timeRange === 'monthly') {
      start.setMonth(now.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
    } else if (timeRange === 'yearly') {
      start.setFullYear(now.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
    } else {
      return { start: undefined, end: undefined };
    }
    return { start, end };
  }

  async getStudentReport(filters: { startDate?: string; endDate?: string; education?: string; search?: string; timeRange?: string }) {
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

    const dateRange = this.getTimeRangeDates(filters.timeRange, filters.startDate, filters.endDate);

    // ดึงข้อมูลผู้เรียนทั้งหมด พร้อมกิจกรรม (activities) ที่กรองตามช่วงเวลา (dateRange)
    const students = await this.prisma.userProfile.findMany({
      where,
      include: {
        education: true,
        userSessions: true,
        activities: {
          where: {
            status: { not: 'PENDING' },
            ...( (dateRange.start || dateRange.end) ? {
              createdAt: {
                gte: dateRange.start,
                lte: dateRange.end,
              },
            } : {} ),
          },
          select: {
            score: true,
            runCount: true,
            eventType: true,
            createdAt: true,
          },
        },
      },
    });

    const totalSessions = await this.prisma.session.count();

    return students.map((student) => {
      // 1. จำนวนครั้งที่มีการกดทดลองรันโค้ดจริง (eventType === 'run')
      const totalSubmissions = student.activities.filter((a) => a.eventType === 'run' || !a.eventType).length;

      // 2. จำนวนครั้งที่ทดลองรัน/ส่งตรวจแล้วผ่านเกณฑ์สำเร็จ (คะแนน >= 80)
      const passedSubmissions = student.activities.filter((a) => a.score >= 80).length;

      const completedSessions = student.userSessions.filter(
        (us) => us.status === 'COMPLETED',
      ).length;

      const scores = student.activities.map((a) => a.score);
      const averageScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

      const runs = student.activities.map((a) => a.runCount);
      const averageAttempts = runs.length > 0 ? runs.reduce((sum, r) => sum + r, 0) / runs.length : 0;

      return {
        userId: student.userId,
        username: student.username,
        fullName: `${student.firstName} ${student.lastName}`,
        university: student.education?.university || '-',
        faculty: student.education?.faculty || '-',
        completedSessions,
        totalSubmissions, // จำนวนครั้งส่งตรวจ/รันโค้ดจริง
        passedSubmissions, // จำนวนครั้งที่ตรวจผ่านสำเร็จ
        totalSessions,
        averageScore,
        averageAttempts,
        lastActiveAt: student.lastActiveAt,
      };
    });
  }

  async getExerciseReport(filters: { startDate?: string; endDate?: string; education?: string; timeRange?: string }) {
    const dateRange = this.getTimeRangeDates(filters.timeRange, filters.startDate, filters.endDate);
    const exercises = await this.prisma.exercise.findMany({
      include: {
        activities: {
            where: {
                user: filters.education ? {
                    education: {
                        OR: [
                          { university: { contains: filters.education, mode: 'insensitive' } },
                          { faculty: { contains: filters.education, mode: 'insensitive' } },
                        ],
                    }
                } : undefined,
                createdAt: (dateRange.start || dateRange.end) ? {
                    gte: dateRange.start,
                    lte: dateRange.end,
                } : undefined,
            },
            select: {
                status: true,
                runCount: true,
                hintUsed: true,
                startedAt: true,
                submittedAt: true,
            },
        },
      },
    });

    return exercises.map((ex) => {
        const totalActivities = ex.activities.length;
        const successActivities = ex.activities.filter((a) => a.status === 'SUCCESS').length;
        const successRate = totalActivities > 0 ? (successActivities / totalActivities) * 100 : 0;

        const runs = ex.activities.map((a) => a.runCount);
        const averageAttempts = runs.length > 0 ? runs.reduce((sum, r) => sum + r, 0) / runs.length : 0;        

        const hintUsedCount = ex.activities.filter((a) => a.hintUsed).length;
        const hintUsageRate = totalActivities > 0 ? (hintUsedCount / totalActivities) * 100 : 0;

        const times = ex.activities.filter((a) => a.startedAt && a.submittedAt).map((a) => {
          const diffMs = new Date(a.submittedAt).getTime() - new Date(a.startedAt).getTime();
            return diffMs / (1000 * 60);
        });

        const averageTimeSpentMinutes = times.length > 0 ? times.reduce((sum, t) => sum + t, 0) / times.length : 0;
        
        return { 
          exerciseId: ex.exerciseId,
          title: ex.title,
          topic: ex.topic,
          difficultyLevel: ex.difficultyLevel,
          successRate,
          averageAttempts,
          hintUsageRate,
          avgTimeSpentMinutes: averageTimeSpentMinutes,
          expectedTimeMinutes: ex.expectedTime,
         };
      });
  }

  async getErrorReport(filter: { startDate?: string; endDate?: string; education?: string; timeRange?: string }) {
    const where: any = {
      exceptionMessage: { not: null },
    };

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

    const dateRange = this.getTimeRangeDates(filter.timeRange, filter.startDate, filter.endDate);
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

    return Array.from(errorMap.entries()).map(([type, data]) => ({
        errorType: type,
        occurrenceCount: data.count,
        percentage: (data.count / totalErrors) * 100,
        commonExceptionMessage: data.examples[0] || '', })).sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  }
}
