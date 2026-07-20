import { Controller, Post, Body, Res, Req, UseGuards, UnauthorizedException, Get } from '@nestjs/common';
import * as express from 'express';
import { AppService } from './app.service';
import { CodeProcessor } from './code.processor';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly codeProcessor: CodeProcessor,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  async login(
    @Body() body: any,
    @Res({ passthrough: true }) response: express.Response,
  ){
    const user = await this.authService.vallidateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Username หรือ Password ไม่ถูกต้อง')
    }
    
    const token = this.authService.login(user);

    response.cookie('access_token', token,{
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
  async logout(@Res({ passthrough: true }) response: express.Response) {
    response.clearCookie('access_token');
    return { message: 'Logout success' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('problems')
  getProblems() {
    return this.codeProcessor.getProblems();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
 