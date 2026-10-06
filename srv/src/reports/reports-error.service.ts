import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getTimeRangeDates } from './utils/thai-date.util';

export interface ErrorReportFilter {
  startDate?: string;
  endDate?: string;
  education?: string;
  search?: string;
  timeRange?: string;
}

@Injectable()
export class ReportsErrorService {
  constructor(private readonly prisma: PrismaService) {}

  parseErrorType(msg: string): string {
    if (!msg) return 'RuntimeError';
    if (msg.includes('TimeLimitExceeded')) return 'TimeLimitExceeded';
    const match = msg.match(/\b([a-zA-Z]+Error):/);
    if (match) return match[1];
    if (msg.includes('SyntaxError')) return 'SyntaxError';
    if (msg.includes('IndentationError')) return 'IndentationError';
    if (msg.includes('NameError')) return 'NameError';
    if (msg.includes('TypeError')) return 'TypeError';
    if (msg.includes('ValueError')) return 'ValueError';
    if (msg.includes('ZeroDivisionError')) return 'ZeroDivisionError';
    if (msg.includes('IndexError')) return 'IndexError';
    if (msg.includes('KeyError')) return 'KeyError';
    if (msg.includes('AttributeError')) return 'AttributeError';
    if (msg.includes('RecursionError')) return 'RecursionError';
    return 'RuntimeError';
  }

  async getErrorReport(filter: ErrorReportFilter) {
    // 1. กำหนดเงื่อนไขดึงเฉพาะ Activity ที่มีข้อความ Exception จริง
    const where: any = {
      exceptionMessage: { not: null },
      NOT: { exceptionMessage: '' },
    };

    // ค้นหาได้ครอบคลุม: ข้อความ Error, รหัส/ชื่อผู้เรียน, ชื่อโจทย์
    if (filter.search) {
      where.OR = [
        { exceptionMessage: { contains: filter.search, mode: 'insensitive' } },
        {
          user: { username: { contains: filter.search, mode: 'insensitive' } },
        },
        {
          user: { firstName: { contains: filter.search, mode: 'insensitive' } },
        },
        {
          user: { lastName: { contains: filter.search, mode: 'insensitive' } },
        },
        {
          exercise: { title: { contains: filter.search, mode: 'insensitive' } },
        },
      ];
    }

    // กรองตามสถาบัน/คณะของผู้เรียน
    if (filter.education) {
      where.user = {
        ...where.user,
        education: {
          OR: [
            { university: { contains: filter.education, mode: 'insensitive' } },
            { faculty: { contains: filter.education, mode: 'insensitive' } },
          ],
        },
      };
    }

    // กรองตามช่วงเวลาที่กำหนด
    const dateRange = getTimeRangeDates(
      filter.timeRange,
      filter.startDate,
      filter.endDate,
    );
    if (dateRange.start || dateRange.end) {
      where.createdAt = {};
      if (dateRange.start) where.createdAt.gte = dateRange.start;
      if (dateRange.end) where.createdAt.lte = dateRange.end;
    }

    // 2. ดึงประวัติกิจกรรมพร้อมข้อมูลผู้เรียนและแบบฝึกหัด
    const activitiesWithError = await this.prisma.activity.findMany({
      where,
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            firstName: true,
            lastName: true,
            education: {
              select: {
                university: true,
                faculty: true,
              },
            },
          },
        },
        exercise: {
          select: {
            exerciseId: true,
            title: true,
            topic: true,
            difficultyLevel: true,
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    const totalErrors = activitiesWithError.length;
    if (totalErrors === 0) {
      return {
        totalSystemExceptions: 0,
        totalAffectedStudents: 0,
        topErrorType: '-',
        errorTypeDistribution: [],
        studentExceptions: [],
      };
    }

    // 3. รวมสถิติประเภทข้อผิดพลาดทั้งระบบ (Error Distribution)
    const errorMap = new Map<string, { count: number; examples: string[] }>();
    activitiesWithError.forEach((act) => {
      const msg = act.exceptionMessage || '';
      const errorType = this.parseErrorType(msg);

      if (!errorMap.has(errorType)) {
        errorMap.set(errorType, { count: 0, examples: [] });
      }
      const item = errorMap.get(errorType)!;
      item.count++;
      if (item.examples.length < 3 && msg) {
        item.examples.push(msg);
      }
    });

    const errorTypeDistribution = Array.from(errorMap.entries())
      .map(([type, data]) => ({
        errorType: type,
        occurrenceCount: data.count,
        percentage: (data.count / totalErrors) * 100,
        commonExceptionMessage: data.examples[0] || '',
      }))
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount);

    // 4. จัดกลุ่มข้อผิดพลาดแยกตามผู้เรียน และตามแบบฝึกหัด (Student Exception Breakdown)
    const studentMap = new Map<
      number,
      {
        userId: number;
        username: string;
        fullName: string;
        university: string;
        faculty: string;
        totalExceptions: number;
        exerciseMap: Map<
          number,
          {
            exerciseId: number;
            title: string;
            topic: string;
            totalExceptions: number;
            errorTypes: Record<string, number>;
            latestActivity?: any;
          }
        >;
      }
    >();

    activitiesWithError.forEach((act) => {
      const uid = act.userId;
      if (!studentMap.has(uid)) {
        studentMap.set(uid, {
          userId: act.user?.userId || uid,
          username: act.user?.username || `user_${uid}`,
          fullName: act.user
            ? `${act.user.firstName} ${act.user.lastName}`.trim()
            : `ผู้เรียน #${uid}`,
          university: act.user?.education?.university || '-',
          faculty: act.user?.education?.faculty || '-',
          totalExceptions: 0,
          exerciseMap: new Map(),
        });
      }

      const st = studentMap.get(uid)!;
      st.totalExceptions++;

      const exId = act.exerciseId;
      if (!st.exerciseMap.has(exId)) {
        st.exerciseMap.set(exId, {
          exerciseId: exId,
          title: act.exercise?.title || `แบบฝึกหัด #${exId}`,
          topic: act.exercise?.topic || '-',
          totalExceptions: 0,
          errorTypes: {},
          latestActivity: {
            activityId: act.activityId,
            userId: act.userId,
            exerciseId: act.exerciseId,
            sessionId: act.sessionId,
            startedAt: act.startedAt,
            submittedAt: act.submittedAt,
            hintUsed: act.hintUsed,
            answer: act.answer,
            score: act.score,
            status: act.status,
            output: act.output,
            exceptionMessage: act.exceptionMessage,
            aiFeedback: act.aiFeedback,
            eventType: act.eventType,
            runCount: act.runCount,
            exercise: act.exercise,
          },
        });
      }

      const ex = st.exerciseMap.get(exId)!;
      ex.totalExceptions++;
      const errType = this.parseErrorType(act.exceptionMessage || '');
      ex.errorTypes[errType] = (ex.errorTypes[errType] || 0) + 1;
    });

    // เรียงลำดับนักศึกษาที่เจอปัญหามากที่สุดขึ้นก่อน เพื่อให้อาจารย์มองเห็นได้ทันที
    const studentExceptions = Array.from(studentMap.values())
      .map((st) => ({
        userId: st.userId,
        username: st.username,
        fullName: st.fullName,
        university: st.university,
        faculty: st.faculty,
        totalExceptions: st.totalExceptions,
        exercises: Array.from(st.exerciseMap.values()).sort(
          (a, b) => b.totalExceptions - a.totalExceptions,
        ),
      }))
      .sort((a, b) => b.totalExceptions - a.totalExceptions);

    return {
      totalSystemExceptions: totalErrors,
      totalAffectedStudents: studentExceptions.length,
      topErrorType: errorTypeDistribution[0]?.errorType || '-',
      errorTypeDistribution,
      studentExceptions,
    };
  }
}
