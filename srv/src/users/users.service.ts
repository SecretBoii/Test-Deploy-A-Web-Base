import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, roleId?: number, status?: 'online' | 'offline') {
    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (roleId !== undefined) {
      where.roleId = roleId;
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (status === 'online') {
      where.lastActiveAt = { gte: fiveMinutesAgo };
    } else if (status === 'offline') {
      where.OR = [
        { lastActiveAt: null },
        { lastActiveAt: { lt: fiveMinutesAgo } },
      ];
    }

    const users = await this.prisma.userProfile.findMany({
      where,
      include: {
        role: true,
        education: true,
      },
      orderBy: {
        userId: 'asc',
      },
    });

    return users.map((user) => {
      const isOnline = user.lastActiveAt
        ? Date.now() - new Date(user.lastActiveAt).getTime() < 5 * 60 * 1000
        : false;
      const { password, ...result } = user;
      return {
        ...result,
        isOnline,
      };
    });
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

  async create(dto: CreateUserDto) {
    const existingUsername = await this.prisma.userProfile.findFirst({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new BadRequestException('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
    }

    const existingEmail = await this.prisma.userProfile.findUnique({
      where: { email: dto.email.trim() },
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
        username: dto.username,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
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

  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.userProfile.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้ที่ต้องการแก้ไข');
    }

    if (dto.email && dto.email.trim() !== user.email) {
      const existingEmail = await this.prisma.userProfile.findUnique({
        where: { email: dto.email.trim() },
      });
      if (existingEmail) {
        throw new BadRequestException('อีเมลนี้มีผู้ใช้ระบบแล้ว');
      }
    }

    if (dto.university || dto.faculty || dto.major) {
      await this.prisma.education.update({
        where: { educationId: user.educationId },
        data: {
          university: dto.university ?? undefined,
          faculty: dto.faculty ?? undefined,
          major: dto.major ?? undefined,
        },
      });
    }

    const updateData: any = {};
    if (dto.username) updateData.username = dto.username;
    if (dto.firstName) updateData.firstName = dto.firstName;
    if (dto.lastName) updateData.lastName = dto.lastName;
    if (dto.email) updateData.email = dto.email;
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
