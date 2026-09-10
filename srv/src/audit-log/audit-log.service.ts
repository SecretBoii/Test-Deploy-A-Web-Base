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

    const where: Prisma.AuditLogWhereInput = {};

    if (action) {
      where.action = action;
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { entity: { contains: search, mode: 'insensitive' } },
        { action: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }


    const [logs, total, createOrAuthCount, updateCount, deleteOrSecurityCount] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.count({
        where: {
          ...where,
          OR: [
            { action: { contains: 'CREATE', mode: 'insensitive' } },
            { action: { contains: 'LOGIN', mode: 'insensitive' } },
          ],
        },
      }),
      this.prisma.auditLog.count({
        where: {
          ...where,
          action: { contains: 'UPDATE', mode: 'insensitive' },
        },
      }),
      this.prisma.auditLog.count({
        where: {
          ...where,
          OR: [
            { action: { contains: 'DELETE', mode: 'insensitive' } },
            { action: { contains: 'SECURITY', mode: 'insensitive' } },
            { action: { contains: 'REMOVE', mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return {
      data: logs,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      stats: {
        total,
        createOrAuthCount,
        updateCount,
        deleteOrSecurityCount,
      },
    };
  }
}