import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { UpdateProfileDto } from "./dto/profile.dto";


@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private jwtService: JwtService, 
    ) {}

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.prisma.userProfile.findFirst({
            where: { username },
        });

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    login(user: any) {
        const payload = { username: user.username, sub: user.userId, roleId: user.roleId };
        return this.jwtService.sign(payload); 
    }

    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.userProfile.findFirst({
            where: { username: dto.username },
        });
        
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        
        const education = await this.prisma.education.create({
            data: {
                university: dto.university,
                faculty: dto.faculty,
                major: dto.major,
            }
        });

        const newUser = await this.prisma.userProfile.create({
            data: {
                username: dto.username,
                password: hashedPassword,
                gender: dto.gender,
                dateOfBirth: new Date(dto.dateOfBirth),
                educationId: education.educationId,
                roleId: 1,
            },
            select: {
                userId: true,
                username: true,
                roleId: true,
            }
        });

        return newUser
    }

    async getProfileDetails(userId: number) {
        const user = await this.prisma.userProfile.findFirst({
            where: { userId },
            include: {
                education: true,
            },
        });
        if (!user) {
            throw new NotFoundException('ไม่พบผู้ใช้งานในระบบ')
        }

        const solvedCount = await this.prisma.activity.groupBy({
            by: ['exerciseId'],
            where: {
                userId,
                eventType: 'submit',
                score: { gt:0 },
            },
        }).then(res => res.length);

        const activeSessions = await this.prisma.session.findMany({
            where: { status: 'active'},
            include: { sessionExercises: true },
        });
        const activeExerciseIds = Array.from(
            new Set(activeSessions.flatMap(s => s.sessionExercises.map(
                se => se.exerciseId
            )))
        );
        const totalExercises = activeExerciseIds.length;

        const submissions = await this.prisma.activity.findMany({
            where: {
                userId,
                eventType: 'submit',

            },
            select: { score: true },
        })
        const totalSubmissions = submissions.length;

        const averageScore = totalSubmissions > 0 ? Math.round(submissions.reduce((sum, s) => sum + s.score, 0) / totalSubmissions)
            : 0;

        const successSubmissions = await this.prisma.activity.count({
            where: {
                userId,
                eventType: 'submit',
                score: { gte: 80 },
            },
        });

        const userRuns = await this.prisma.activity.groupBy({
            by: ['exerciseId'],
            where: { userId },
            _max: {
                runCount: true,
            },
        });
        const attemptedExercises = userRuns.length;
        const totalRuns = userRuns.reduce((sum, item) => sum + (item._max.runCount || 0), 0);
        const averageRuns = attemptedExercises > 0
            ? Number((totalRuns / attemptedExercises).toFixed(1))
            : 0.0;
        // 7. ส่งข้อมูลรายละเอียดผู้ใช้และสถิติหลักกลับไป
        return {
            userId: user.userId,
            username: user.username,
            gender: user.gender,
            dateOfBirth: user.dateOfBirth,
            registerTimestamp: user.registerTimestamp,
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
            }
        };
    }
    async updateProfile(userId: number, dto: UpdateProfileDto) {
        const user = await this.prisma.userProfile.findUnique({
            where: { userId },
            include: { education: true }
        });
        if (!user) {
            throw new NotFoundException('ไม่พบผู้ใช้งานนี้ในระบบ');
        }
        // ตรวจสอบกรณีเปลี่ยน Username ว่าไปซ้ำกับคนอื่นหรือไม่
        if (dto.username && dto.username !== user.username) {
            const existingUser = await this.prisma.userProfile.findFirst({
                where: { username: dto.username },
            });
            if (existingUser) {
                throw new BadRequestException('Username นี้ถูกใช้งานไปแล้ว');
            }
        }
        const profileData: any = {};
        if (dto.username) profileData.username = dto.username;
        if (dto.gender) profileData.gender = dto.gender;
        if (dto.dateOfBirth) profileData.dateOfBirth = new Date(dto.dateOfBirth);
        // หากกรอกรหัสผ่านใหม่เข้ามา ให้ทำการแฮชรหัสผ่านความปลอดภัยด้วย bcrypt
        if (dto.password && dto.password.trim() !== '') {
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
                    }
                });
            } else {
                const newEducation = await this.prisma.education.create({
                    data: {
                        university: 'PSU',
                        faculty: dto.faculty || '',
                        major: dto.major || '',
                    }
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
                roleId: true
            }
        });
        return updatedUser;
    }

            
    
}
