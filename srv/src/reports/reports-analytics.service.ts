import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getThaiDateTime, getTimeRangeDates } from './utils/thai-date.util';

export interface UsageAnalyticsFilter {
  startDate?: string;
  endDate?: string;
}

export interface RecentSubmissionsFilter {
  limit: number;
  startDate?: string;
  endDate?: string;
  eventType?: string;
}

@Injectable()
export class ReportsAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsageAnalytics(filters: UsageAnalyticsFilter) {
    const dateRange = getTimeRangeDates(
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
      const thai = getThaiDateTime(l.createdAt);
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

  async getRecentSubmissions(filters: RecentSubmissionsFilter) {
    const dateRange = getTimeRangeDates(
      undefined,
      filters.startDate,
      filters.endDate,
    );

    return await this.prisma.activity.findMany({
      where: {
        eventType:
          filters.eventType && filters.eventType !== 'all'
            ? filters.eventType
            : undefined,
        createdAt:
          dateRange.start || dateRange.end
            ? {
                gte: dateRange.start,
                lte: dateRange.end,
              }
            : undefined,
      },
      take: filters.limit,
      orderBy: { submittedAt: 'desc' },
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            firstName: true,
            lastName: true,
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
        session: {
          select: {
            sessionId: true,
            sessionName: true,
          },
        },
      },
    });
  }
}
