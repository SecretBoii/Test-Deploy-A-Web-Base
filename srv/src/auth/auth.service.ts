import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const users = await this.prisma.userProfile.findMany({
      where: { username },
    });

    for (const user of users) {
      if (await bcrypt.compare(pass, user.password)) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  login(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      roleId: user.roleId,
    };
    return this.jwtService.sign(payload);
  }

  async register(dto: RegisterDto) {
    if (dto.password.trim() === dto.username.trim()) {
      throw new Error('รหัสผ่านต้องไม่ตรงกับชื่อผู้ใช้งาน');
    }

    const existingUsers = await this.prisma.userProfile.findMany({
      where: { username: dto.username },
    });

    for (const u of existingUsers) {
      if (await bcrypt.compare(dto.password, u.password)) {
        throw new Error(
          'Username และ Password นี้ถูกใช้งานร่วมกันโดยบัญชีอื่นแล้ว',
        );
      }
    }

    const existingEmail = await this.prisma.userProfile.findUnique({
      where: { email: dto.email.trim() },
    });

    if (existingEmail) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const education = await this.prisma.education.create({
      data: {
        university: dto.university,
        faculty: dto.faculty,
        major: dto.major,
      },
    });

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
        roleId: 1,
      },
      select: {
        userId: true,
        username: true,
        roleId: true,
      },
    });

    return newUser;
  }

  async getProfileDetails(userId: number) {
    const user = await this.prisma.userProfile.findFirst({
      where: { userId },
      include: {
        education: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้งานในระบบ');
    }

    // 1. ดึงรายการโจทย์ที่ไม่ซ้ำซึ่งผูกอยู่ใน Session ที่เปิดใช้งาน (status: 'active') และโจทย์มีสถานะ active
    const inSessionExercises = await this.prisma.sessionExercise.findMany({
      where: {
        session: { status: 'active' },
        exercise: { status: 'active' },
      },
      select: { exerciseId: true },
      distinct: ['exerciseId'],
    });

    const activeExerciseIds = inSessionExercises.map((se) => se.exerciseId);
    const totalExercises = activeExerciseIds.length;

    // 2. คำนวณจำนวนโจทย์ในบทเรียนที่ผู้เรียนทำคะแนนผ่านเกณฑ์ (>= 80 คะแนน)
    let solvedCount = 0;
    if (activeExerciseIds.length > 0) {
      const passedActivities = await this.prisma.activity.findMany({
        where: {
          userId,
          exerciseId: { in: activeExerciseIds },
          score: { gte: 80 },
        },
        select: { exerciseId: true },
        distinct: ['exerciseId'],
      });
      solvedCount = Math.min(passedActivities.length, totalExercises);
    }

    // 3. คำนวณคะแนนเฉลี่ยจากการส่งตรวจ (Submit) เฉพาะโจทย์ในหลักสูตร
    const submissions = await this.prisma.activity.findMany({
      where: {
        userId,
        eventType: 'submit',
        ...(activeExerciseIds.length > 0
          ? { exerciseId: { in: activeExerciseIds } }
          : {}),
      },
      select: { score: true },
    });
    const totalSubmissions = submissions.length;

    const averageScore =
      totalSubmissions > 0
        ? Math.round(
            submissions.reduce((sum, s) => sum + s.score, 0) / totalSubmissions,
          )
        : 0;

    const successSubmissions = await this.prisma.activity.count({
      where: {
        userId,
        eventType: 'submit',
        score: { gte: 80 },
        ...(activeExerciseIds.length > 0
          ? { exerciseId: { in: activeExerciseIds } }
          : {}),
      },
    });

    const userRuns = await this.prisma.activity.groupBy({
      by: ['exerciseId'],
      where: {
        userId,
        ...(activeExerciseIds.length > 0
          ? { exerciseId: { in: activeExerciseIds } }
          : {}),
      },
      _max: {
        runCount: true,
      },
    });
    const attemptedExercises = userRuns.length;
    const totalRuns = userRuns.reduce(
      (sum, item) => sum + (item._max.runCount || 0),
      0,
    );
    const averageRuns =
      attemptedExercises > 0
        ? Number((totalRuns / attemptedExercises).toFixed(1))
        : 0.0;
    // 7. ส่งข้อมูลรายละเอียดผู้ใช้และสถิติหลักกลับไป
    return {
      userId: user.userId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      registerTimestamp: user.registerTimestamp,
      roleName: user.role?.roleName || '',
      education: {
        university: user.education?.university || '-',
        faculty: user.education?.faculty || '-',
        major: user.education?.major || '-',
      },
      stats: {
        solvedExercises: solvedCount,
        totalExercises: totalExercises,
        averageScore: averageScore,
        successSubmissions: successSubmissions,
        averageRuns: averageRuns,
      },
    };
  }
  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { education: true },
    });
    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้งานนี้ในระบบ');
    }
    // ตรวจสอบกรณีเปลี่ยน Username ว่าไปซ้ำกับคนอื่นหรือไม่ (อนุญาตให้ซ้ำได้ แต่ป้องกัน Username + Password ชนกันในส่วนเช็กรหัสผ่าน)
    // ตรวจสอบกรณีเปลี่ยน Email ว่าไปซ้ำกับคนอื่นหรือไม่
    if (dto.email && dto.email.trim() !== user.email) {
      const existingEmail = await this.prisma.userProfile.findUnique({
        where: { email: dto.email.trim() },
      });
      if (existingEmail) {
        throw new BadRequestException('อีเมลนี้ถูกใช้งานไปแล้ว');
      }
    }
    const profileData: any = {};
    if (dto.username) profileData.username = dto.username;
    if (dto.firstName) profileData.firstName = dto.firstName;
    if (dto.lastName) profileData.lastName = dto.lastName;
    if (dto.email) profileData.email = dto.email;
    if (dto.gender) profileData.gender = dto.gender;
    if (dto.dateOfBirth) profileData.dateOfBirth = new Date(dto.dateOfBirth);
    // หากกรอกรหัสผ่านใหม่เข้ามา ให้ทำการแฮชรหัสผ่านความปลอดภัยด้วย bcrypt
    if (dto.password && dto.password.trim() !== '') {
      const finalUsername = dto.username || user.username;
      if (dto.password.trim() === finalUsername.trim()) {
        throw new BadRequestException('รหัสผ่านต้องไม่ตรงกับชื่อผู้ใช้งาน');
      }

      const otherUsers = await this.prisma.userProfile.findMany({
        where: {
          username: finalUsername,
          NOT: { userId: user.userId },
        },
      });

      for (const u of otherUsers) {
        if (await bcrypt.compare(dto.password, u.password)) {
          throw new BadRequestException(
            'Username และ Password นี้ถูกใช้งานร่วมกันโดยบัญชีอื่นแล้ว',
          );
        }
      }

      profileData.password = await bcrypt.hash(dto.password, 10);
    }
    // อัปเดตตารางข้อมูลประวัติการศึกษา (Education)
    if (dto.faculty || dto.major) {
      if (user.educationId) {
        await this.prisma.education.update({
          where: { educationId: user.educationId },
          data: {
            faculty: dto.faculty ?? undefined,
            major: dto.major ?? undefined,
          },
        });
      } else {
        const newEducation = await this.prisma.education.create({
          data: {
            university: 'PSU',
            faculty: dto.faculty || '',
            major: dto.major || '',
          },
        });
        profileData.educationId = newEducation.educationId;
      }
    }
    // อัปเดตข้อมูลในตารางหลัก UserProfile
    const updatedUser = await this.prisma.userProfile.update({
      where: { userId },
      data: profileData,
      select: {
        userId: true,
        username: true,
        roleId: true,
      },
    });
    return updatedUser;
  }
}
