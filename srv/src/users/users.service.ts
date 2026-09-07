import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * ค้นหาผู้ใช้งานทั้งหมดตามเงื่อนไข (Search, Role, Status) พร้อมรองรับ Pagination
   * เหตุผลที่ใช้ Promise.all: เพื่อดึงข้อมูล User (findMany) และนับจำนวนรายการทั้งหมด (count) พร้อมกันในระดับ Database
   * เพื่อลด latency และเพิ่มประสิทธิภาพการประมวลผลของระบบ
   */
  async findAll(
    search?: string,
    roleId?: number,
    status?: 'online' | 'offline',
    page?: number,
    limit?: number,
  ) {
    const whereConditions: any[] = [];

    if (search) {
      whereConditions.push({
        OR: [
          { username: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (roleId !== undefined) {
      whereConditions.push({ roleId });
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (status === 'online') {
      whereConditions.push({ lastActiveAt: { gte: fiveMinutesAgo } });
    } else if (status === 'offline') {
      whereConditions.push({
        OR: [
          { lastActiveAt: null },
          { lastActiveAt: { lt: fiveMinutesAgo } },
        ],
      });
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit ? limit : undefined;

    const [users, total, systemTotal, onlineCount, studentCount, teacherCount] = await Promise.all([
      this.prisma.userProfile.findMany({
        where,
        include: {
          role: true,
          education: true,
        },
        orderBy: {
          userId: 'asc',
        },
        skip,
        take,
      }),
      this.prisma.userProfile.count({ where }),
      this.prisma.userProfile.count(),
      this.prisma.userProfile.count({
        where: { lastActiveAt: { gte: fiveMinutesAgo } },
      }),
      this.prisma.userProfile.count({ where: { roleId: 1 } }),
      this.prisma.userProfile.count({ where: { roleId: { in: [2, 3] } } }),
    ]);

    const data = users.map((user) => {
      const isOnline = user.lastActiveAt
        ? Date.now() - new Date(user.lastActiveAt).getTime() < 5 * 60 * 1000
        : false;
      const { password, ...result } = user;
      return {
        ...result,
        isOnline,
      };
    });

    return {
      data,
      total,
      stats: {
        total: systemTotal,
        onlineCount,
        studentCount,
        teacherCount,
      },
      page: page || 1,
      limit: limit || total,
      totalPages: limit ? Math.ceil(total / limit) : 1,
    };
  }

  async findOne(userId: number) {
    const user = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        role: true,
        education: true,
      },
    });
    if (!user) return null;

    const { password, ...result } = user;
    const isOnline = user.lastActiveAt
      ? Date.now() - new Date(user.lastActiveAt).getTime() < 5 * 60 * 1000
      : false;
    return {
      ...result,
      isOnline,
    };
  }

  /**
   * สร้างบัญชีผู้ใช้ใหม่พร้อมตรวจสอบความซ้ำซ้อนของ Username และ Email
   * เหตุผลที่ต้อง trim() อีเมล: ป้องกันปัญหาการตัดคำและช่องว่างเกินในระบบล็อกอิน
   */
  async create(dto: CreateUserDto) {
    const trimmedEmail = dto.email.trim();

    const existingUsername = await this.prisma.userProfile.findFirst({
      where: { username: dto.username.trim() },
    });
    if (existingUsername) {
      throw new BadRequestException('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
    }

    const existingEmail = await this.prisma.userProfile.findUnique({
      where: { email: trimmedEmail },
    });
    if (existingEmail) {
      throw new BadRequestException('อีเมลนี้ถูกใช้งานแล้ว');
    }

    const education = await this.prisma.education.create({
      data: {
        university: dto.university || 'Default University',
        faculty: dto.faculty || 'Default Faculty',
        major: dto.major || 'Default Major',
      },
    });

    const hashedPassword = await bcrypt.hash(dto.password || '1234', 10);

    const newUser = await this.prisma.userProfile.create({
      data: {
        username: dto.username.trim(),
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: trimmedEmail,
        gender: dto.gender,
        dateOfBirth: new Date(dto.dateOfBirth),
        educationId: education.educationId,
        roleId: dto.roleId,
      },
      include: {
        role: true,
        education: true,
      },
    });

    const { password, ...result } = newUser;
    return result;
  }

  /**
   * อัปเดตข้อมูลผู้ใช้งานพร้อมจัดการ Education และ Password แบบปลอดภัย
   * เหตุผลที่เช็ค user.educationId: ป้องกัน Prisma runtime error หากผู้ใช้ยังไม่มีข้อมูลการศึกษาเดิมใน DB
   */
  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้ที่ต้องการแก้ไข');
    }

    const updateData: any = {};

    if (dto.email && dto.email.trim() !== user.email) {
      const trimmedEmail = dto.email.trim();
      const existingEmail = await this.prisma.userProfile.findUnique({
        where: { email: trimmedEmail },
      });
      if (existingEmail) {
        throw new BadRequestException('อีเมลนี้มีผู้ใช้ระบบแล้ว');
      }
      updateData.email = trimmedEmail;
    }

    if (dto.university || dto.faculty || dto.major) {
      if (user.educationId) {
        await this.prisma.education.update({
          where: { educationId: user.educationId },
          data: {
            university: dto.university ?? undefined,
            faculty: dto.faculty ?? undefined,
            major: dto.major ?? undefined,
          },
        });
      } else {
        const newEducation = await this.prisma.education.create({
          data: {
            university: dto.university || 'Default University',
            faculty: dto.faculty || 'Default Faculty',
            major: dto.major || 'Default Major',
          },
        });
        updateData.educationId = newEducation.educationId;
      }
    }

    if (dto.username) updateData.username = dto.username.trim();
    if (dto.firstName) updateData.firstName = dto.firstName;
    if (dto.lastName) updateData.lastName = dto.lastName;
    if (dto.gender) updateData.gender = dto.gender;
    if (dto.dateOfBirth) updateData.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.roleId !== undefined) updateData.roleId = dto.roleId;

    if (dto.password && dto.password.trim() !== '') {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.prisma.userProfile.update({
      where: { userId },
      data: updateData,
      include: {
        role: true,
        education: true,
      },
    });

    const { password, ...result } = updatedUser;
    return result;
  }

  async delete(userId: number) {
    const user = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้ที่ต้องการลบ');
    }

    await this.prisma.userProfile.delete({
      where: { userId },
    });

    if (user.educationId) {
      await this.prisma.education.delete({
        where: { educationId: user.educationId },
      }).catch((e) => console.log('Clean-up education skipped:', e.message));
    }

    return { success: true, message: 'ลบผู้ใช้เสร็จสิ้น' };
  }
}
