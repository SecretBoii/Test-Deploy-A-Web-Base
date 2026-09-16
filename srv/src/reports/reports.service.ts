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
      dayOfWeek: thaiTime.getUTCDay(),   // 0 = อาทิตย์, 1 = จันทร์, ...
      dayOfMonth: thaiTime.getUTCDate(), // วันที่ 1 - 31
      month: thaiTime.getUTCMonth(),     // เดือน 0 (ม.ค.) - 11 (ธ.ค.)
      year: thaiTime.getUTCFullYear(),
    };
  }

  private getTimeRangeDates(timeRange?: string, startDate?: string, endDate?: string) {
    if (startDate || endDate) {
      return {
        start: startDate ? new Date(startDate) : undefined,
        end: endDate ? (() => { const d = new Date(endDate); d.setHours(23, 59, 59, 999); return d; })() : undefined,
      };
    }
    if (!timeRange) return { start: undefined, end: undefined };

    // คำนวณวันปัจจุบันตามเวลาประเทศไทย (UTC+7)
    const nowUtc = new Date();
    const nowThai = new Date(nowUtc.getTime() + 7 * 60 * 60 * 1000);
    const year = nowThai.getUTCFullYear();
    const month = nowThai.getUTCMonth();
    const date = nowThai.getUTCDate();
    const day = nowThai.getUTCDay();

    const MS_7_HOURS = 7 * 60 * 60 * 1000;

    if (timeRange === 'daily') {
      // เวลาไทย 00:00:00.000 ถึง 23:59:59.999 ของวันนี้
      const start = new Date(Date.UTC(year, month, date, 0, 0, 0, 0) - MS_7_HOURS);
      const end = new Date(Date.UTC(year, month, date, 23, 59, 59, 999) - MS_7_HOURS);
      return { start, end };
    } else if (timeRange === 'weekly') {
      // วันจันทร์ (00:00:00) ถึงวันอาทิตย์ (23:59:59) ของสัปดาห์ปัจจุบันในไทย
      const diffToMon = day === 0 ? -6 : 1 - day;
      const mondayDate = date + diffToMon;
      const start = new Date(Date.UTC(year, month, mondayDate, 0, 0, 0, 0) - MS_7_HOURS);
      const end = new Date(Date.UTC(year, month, mondayDate + 6, 23, 59, 59, 999) - MS_7_HOURS);
      return { start, end };
    } else if (timeRange === 'monthly') {
      // วันที่ 1 ถึงวันสิ้นเดือนของเดือนปัจจุบันในไทย
      const start = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0) - MS_7_HOURS);
      const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999) - MS_7_HOURS);
      return { start, end };
    } else if (timeRange === 'yearly') {
      // วันที่ 1 ม.ค. ถึง 31 ธ.ค. ของปีปัจจุบันในไทย
      const start = new Date(Date.UTC(year, 0, 1, 0, 0, 0, 0) - MS_7_HOURS);
      const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999) - MS_7_HOURS);
      return { start, end };
    }

    return { start: undefined, end: undefined };
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
      eventType: 'run',
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

  async getUsageAnalytics(filters: { timeRange?: string }) {
    // กำหนดค่าเริ่มต้นเป็น 'daily' ตั้งแต่ต้น เพื่อป้องกันการดึงข้อมูล Log ทั้งหมดในประวัติศาสตร์หากไม่มีการส่งพารามิเตอร์มา
    const timeRange = filters.timeRange || 'daily';
    const dateRange = this.getTimeRangeDates(timeRange);

    const dateWhere = dateRange.start || dateRange.end ? {
      createdAt: {
        gte: dateRange.start,
        lte: dateRange.end,
      },
    } : undefined;

    // ดึงเฉพาะประวัติการเข้าสู่ระบบ (LOGIN) จากตาราง AuditLog เพื่อนำมาทำสถิติความหนาแน่นของการ Login ตามช่วงเวลา
    const auditLogs = await this.prisma.auditLog.findMany({
      where: {
        ...dateWhere,
        action: 'LOGIN',
      },
      select: { createdAt: true },
   });

    // weekly: จัดกลุ่มตามวันในสัปดาห์ (อิงตามเวลาไทย)
    if (timeRange === 'weekly') {
      const counts = [0, 0, 0, 0, 0, 0, 0];
      auditLogs.forEach((l) => {
        const thai = this.getThaiDateTime(l.createdAt);
        counts[thai.dayOfWeek]++;
      });

      return [
        { periodLabel: 'จันทร์', userCount: counts[1] },
        { periodLabel: 'อังคาร', userCount: counts[2] },
        { periodLabel: 'พุธ', userCount: counts[3] },
        { periodLabel: 'พฤหัสบดี', userCount: counts[4] },
        { periodLabel: 'ศุกร์', userCount: counts[5] },
        { periodLabel: 'เสาร์', userCount: counts[6] },
        { periodLabel: 'อาทิตย์', userCount: counts[0] },
      ];
    }

    // monthly: จัดกลุ่มตามสัปดาห์ของเดือน (อิงตามเวลาไทย)
    if (timeRange === 'monthly') {
      const weeks = [0, 0, 0, 0];
      auditLogs.forEach((l) => {
        const thai = this.getThaiDateTime(l.createdAt);
        const d = thai.dayOfMonth;
        if (d <= 7) weeks[0]++;
        else if (d <= 14) weeks[1]++;
        else if (d <= 21) weeks[2]++;
        else weeks[3]++;
      });

      return [
        { periodLabel: 'สัปดาห์ที่ 1', userCount: weeks[0] },
        { periodLabel: 'สัปดาห์ที่ 2', userCount: weeks[1] },
        { periodLabel: 'สัปดาห์ที่ 3', userCount: weeks[2] },
        { periodLabel: 'สัปดาห์ที่ 4', userCount: weeks[3] },
      ];
    }

    // yearly: จัดกลุ่มตามไตรมาส (อิงตามเวลาไทย)
    if (timeRange === 'yearly') {
      const quarters = [0, 0, 0, 0];
      auditLogs.forEach((l) => {
        const thai = this.getThaiDateTime(l.createdAt);
        const q = Math.floor(thai.month / 3);
        quarters[q]++;
      });

      return [
        { periodLabel: 'Q1 (ม.ค.-มี.ค.)', userCount: quarters[0] },
        { periodLabel: 'Q2 (เม.ย.-มิ.ย.)', userCount: quarters[1] },
        { periodLabel: 'Q3 (ก.ค.-ก.ย.)', userCount: quarters[2] },
        { periodLabel: 'Q4 (ต.ค.-ธ.ค.)', userCount: quarters[3] },
      ];
    }

    // daily: จัดกลุ่มตามช่วงเวลา 4 ชั่วโมงต่อ Slot (อิงตามชั่วโมงเวลาไทย Asia/Bangkok)
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

