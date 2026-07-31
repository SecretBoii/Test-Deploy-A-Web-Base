import { Controller, Post, Body, Res, Req, UseGuards, UnauthorizedException, Get } from '@nestjs/common'
import * as express from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController{
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) response: express.Response,
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

        return {
            userId: user.userId,
            username: user.username,
            roleId: user.roleId,
        };
    }

    @Post('logout')
    async logout(@Res({
        passthrough: true }) response: express.Response) {
            response.clearCookie('access_token');
            return { message: 'logout success' };
        }
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: any) {
        return req.user;
    }
}
