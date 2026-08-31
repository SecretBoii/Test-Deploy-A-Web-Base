import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getStudentReport(filters: { startDate?: string; endDate?: string; education?: string; search?: string }) {
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

    if (filters.startDate || filters.endDate) {
      where.registerTimestamp = {};
      if (filters.startDate) {
        where.registerTimestamp.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate);
        end.setHours(23, 59, 59, 999);
        where.registerTimestamp.lte = end;
      }
    }

    const students = await this.prisma.userProfile.findMany({
      where,
      include: {
        education: true,
        userSessions: true,
        activities: {
          where: {
            status: { not: 'PENDING' },
          },
          select: {
            score: true,
            runCount: true,
          },
        },
      },
    });

    const totalSessions = await this.prisma.session.count();

    return students.map((student) => {
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
        fullName: `${student.firstName} ${ student.lastName}`,
        university: student.education?.university || '-',
        faculty: student.education?.faculty || '-',
        completedSessions,
        totalSessions,
        averageScore,
        averageAttempts,
        lastActiveAt: student.lastActiveAt,
      };
    });
  }

  async getExerciseReport(filters: { startDate?: string; endDate?: string; education?: string }) {
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
                createdAt: (filters.startDate || filters.endDate) ? {
                    gte: filters.startDate ? new Date(filters.startDate) : undefined,
                    lte: filters.endDate ? new Date(filters.endDate) : undefined,
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

  async getErrorReport(filter: { startDate?: string; endDate?: string; education?: string }) {
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
    if (filter.startDate || filter.endDate) { 
      where.createdAt = {};
      if (filter.startDate) {
        where.createdAt.gte = new Date(filter.startDate);
      }
      if (filter.endDate) {
        const end = new Date(filter.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
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
