import { Controller, Post, Body, Res, Req, UseGuards, UnauthorizedException, Get, BadRequestException, Put } from '@nestjs/common'
import * as express from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/profile.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AuthController{
    // บันทึกเวลา Login ล่าสุดของผู้ใช้ (In-memory Debounce)
    // เหตุผล: เพื่อป้องกันกรณีผู้ใช้ส่ง Request มาพร้อมกันหลายครั้งในเสี้ยววินาที ไม่ให้บันทึก Audit Log การเข้าสู่ระบบซ้ำซ้อน
    private readonly recentLoginMap = new Map<number, number>();

    constructor(
        private readonly authService: AuthService,
        private readonly auditLogService: AuditLogService,
        private readonly jwtService: JwtService,
    ) {}

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: express.Response,
        @Req() req: express.Request,
    ) {
        const user = await this.authService.validateUser(loginDto.username, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Username หรือ Password ไม่ถูกต้อง');
        }

        const token = this.authService.login(user);

        response.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        // ตรวจสอบว่าผู้ใช้คนเดิมเพิ่งบันทึก Log LOGIN ไปภายใน 3 วินาทีหรือไม่ เพื่อหลีกเลี่ยงการสร้าง Duplicate Audit Log
        const now = Date.now();
        const lastLoginTime = this.recentLoginMap.get(user.userId) || 0;
        if (now - lastLoginTime > 3000) {
            this.recentLoginMap.set(user.userId, now);
            setTimeout(() => this.recentLoginMap.delete(user.userId), 10000);

            await this.auditLogService.logFromRequest(req, {
                action: 'LOGIN',
                entity: 'Auth',
                customUser: { userId: user.userId, username: user.username },
                details: { roleId: user.roleId, method: 'PASSWORD' },
            });
        }

        return {
            userId: user.userId,
            username: user.username,
            roleId: user.roleId,
        };
    }

    @Post('logout')
    async logout(
        @Res({ passthrough: true }) response: express.Response,
        @Req() req: express.Request,
    ) {

        const token = req.cookies?.['access_token'];
        let currentUser: any = null;
        if (token) {
            try {
                currentUser = this.jwtService.decode(token);
            } catch {
                currentUser = null;
            }
        }
        response.clearCookie('access_token');

        // บันทึก Audit Log เมื่อผู้ใช้ออกจากระบบ (ป้องกัน Runtime Error หากไม่มี Token หรือผู้ใช้ไม่ได้ล็อกอินอยู่)
        if (currentUser) {
            await this.auditLogService.logFromRequest(req, {
                action: 'LOGOUT',
                entity: 'Auth',
                customUser: {
                    userId: currentUser.sub || currentUser.userId,
                    username: currentUser.username,
                },
                details: { reason: 'USER_LOGOUT' },
            });
        }
        return { message: 'logout success' };
    }

    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: any) {
        return req.user;
    }

    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
        @Req() req: express.Request,
    ) {
        try {
            const newUser = await this.authService.register(registerDto);
            // บันทึก Audit Log การสมัครสมาชิกใหม่ (ตามกฎ PDPA: ไม่บันทึกรหัสผ่าน)
            await this.auditLogService.logFromRequest(req, {
                action: 'REGISTER',
                entity: 'UserProfile',
                customUser: { userId: newUser.userId, username: newUser.username },
                details: { email: registerDto.email, gender: registerDto.gender },
            });
            return newUser;
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }


    @UseGuards(JwtAuthGuard)
    @Get('profile/details')
    async getProfileDetails(@Req() req: any) {
        return this.authService.getProfileDetails(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('profile/edit')
    async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
        return this.authService.updateProfile(req.user.userId, dto);
    }

}
