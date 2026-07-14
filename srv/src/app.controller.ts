import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CodeProcessor } from './code.processor';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly codeProcessor: CodeProcessor,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('problems')
  getProblems() {
    return this.codeProcessor.getProblems();
  }

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.prisma.userprofile.findFirst({
      where: { username: body.username },
    });

    if (!user || user.password !== body.password) {
      throw new UnauthorizedException('Username หรือ Password ไม่ถูกต้อง');
    }

    return {
      userId: user.userId,
      username: user.username,
      roleId: user.roleId,
    };
  }
}
