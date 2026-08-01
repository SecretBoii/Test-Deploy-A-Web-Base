import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";

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
}
