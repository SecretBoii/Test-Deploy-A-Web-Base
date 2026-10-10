import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * ดึงรายชื่อผู้ใช้งานพร้อมสถิติจำนวนสมาชิกแยกตามบทบาท
   * ปรับปรุง: นำการคำนวณสถานะ Online และฟิลด์ lastActiveAt ออก เพื่อลด overhead และสอดคล้องกับโครงสร้างฐานข้อมูล
   */
  async findAll(
    search?: string,
    roleId?: number,
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

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit ? limit : undefined;

    // ดึงข้อมูลผู้ใช้งานและนับสถิติตามประเภทบทบาทแยกกัน (Student: 1, Teacher: 2, Admin: 3)
    const [users, total, systemTotal, studentCount, teacherCount, adminCount] =
      await Promise.all([
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
        this.prisma.userProfile.count({ where: { roleId: 1 } }),
        this.prisma.userProfile.count({ where: { roleId: 2 } }),
        this.prisma.userProfile.count({ where: { roleId: 3 } }),
      ]);

    const data = users.map((user) => {
      const { password, ...result } = user;
      return result;
    });

    return {
      data,
      total,
      stats: {
        total: systemTotal,
        studentCount,
        teacherCount,
        adminCount,
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
    return result;
  }

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
        university: dto.university || 'ไม่ระบุ',
        faculty: dto.faculty || 'ไม่ระบุ',
        major: dto.major || 'ไม่ระบุ',
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
            university: dto.university || 'ไม่ระบุ',
            faculty: dto.faculty || 'ไม่ระบุ',
            major: dto.major || 'ไม่ระบุ',
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
      await this.prisma.education
        .delete({
          where: { educationId: user.educationId },
        })
        .catch((e) => console.log('Clean-up education skipped:', e.message));
    }

    return { success: true, message: 'ลบผู้ใช้เสร็จสิ้น' };
  }
}
