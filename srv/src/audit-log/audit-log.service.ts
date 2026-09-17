import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogDto } from './dto/audit-log-query.dto';
import { Prisma } from '@prisma/client';

export interface CreateAuditLogInput {
  userId?: number;
  username?: string;
  action: string;
  entity: string;
  entityId?: number;
  details?: any;
}

export interface LogFromRequestParams {
  action: string;
  entity: string;
  entityId?: number;
  details?: Record<string, unknown>;
  customUser?: { userId?: number; username?: string; };
}
@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        username: data.username,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details ?? Prisma.DbNull,
      },
    });
  }

  async logFromRequest(
    req: any,
    params: LogFromRequestParams,
  ) {
    const user = params.customUser || req?.user;

      return this.create({
        userId: user?.userId || user?.sub,
        username: user?.username,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        details: params.details,
      });
  }

  async findAll(query: AuditLogDto) {
    const { page = 1, limit = 10, search, action, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    // 1. เงื่อนไขช่วงเวลา (สำหรับนับสถิติภาพรวม KPI)
    const dateWhere: Prisma.AuditLogWhereInput = {};
    if (startDate || endDate) {
      dateWhere.createdAt = {};
      if (startDate) {
        dateWhere.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateWhere.createdAt.lte = end;
      }
    }

    // 2. เงื่อนไขสำหรับตารางข้อมูล (รวม Search + Action)
    const where: Prisma.AuditLogWhereInput = { ...dateWhere };

    if (action) {
      where.action = { contains: action, mode: 'insensitive' }
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { entity: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
      ];
    }

    // 3. ดึงข้อมูลตารางและนับสถิติโดยใช้ dateWhere (ไม่ทับซ้อนกับ search)
    // ทำการ Join ไปยังตาราง UserProfile -> Role เพื่อดึงข้อมูล Role ของผู้ใช้งานที่กระทำการ
    const [logs, total, totalInSystem, createOrAuthCount, updateCount, deleteOrSecurityCount] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              role: {
                select: {
                  roleName: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.count({ where: dateWhere }),
      this.prisma.auditLog.count({
        where: {
          ...dateWhere,
          OR: [
            { action: { contains: 'CREATE', mode: 'insensitive' } },
            { action: { contains: 'LOGIN', mode: 'insensitive' } },
          ],
        },
      }),
      this.prisma.auditLog.count({
        where: {
          ...dateWhere,
          action: { contains: 'UPDATE', mode: 'insensitive' },
        },
      }),
      this.prisma.auditLog.count({
        where: {
          ...dateWhere,
          OR: [
            { action: { contains: 'DELETE', mode: 'insensitive' } },
            { action: { contains: 'SECURITY', mode: 'insensitive' } },
            { action: { contains: 'REMOVE', mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    // จัดเตรียมข้อมูล Log ส่งกลับให้ Frontend โดยแนบ roleName และ fullName (ชื่อ-นามสกุลจริง) เพื่อนำไปแสดงผล
    const formattedLogs = logs.map((log: any) => {
      let roleName = log.user?.role?.roleName;

      // กรณีที่ผู้ใช้ไม่ได้ผูก relation หรือเป็น log เดิม ให้ตรวจสอบจาก payload details หรือ username
      if (!roleName && log.details && typeof log.details === 'object') {
        const detailsObj = log.details as Record<string, any>;
        if (detailsObj.roleId === 1) roleName = 'Student';
        else if (detailsObj.roleId === 2) roleName = 'Teacher';
        else if (detailsObj.roleId === 3) roleName = 'Admin';
      }

      if (!roleName && log.username?.toLowerCase() === 'admin') {
        roleName = 'Admin';
      }

      // ประกอบชื่อ-นามสกุลจริงของผู้ใช้งาน
      let fullName: string | undefined = undefined;
      if (log.user?.firstName || log.user?.lastName) {
        fullName = `${log.user.firstName || ''} ${log.user.lastName || ''}`.trim();
      }

      const { user, ...rest } = log;
      return {
        ...rest,
        roleName: roleName || undefined,
        fullName: fullName || undefined,
      };
    });

    return {
      data: formattedLogs,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      stats: {
        total: totalInSystem,
        createOrAuthCount,
        updateCount,
        deleteOrSecurityCount,
      },
    };
  }
}