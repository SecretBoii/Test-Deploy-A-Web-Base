import { Controller, Post, Body, Res, Req, UseGuards, UnauthorizedException, Get } from '@nestjs/common';
import * as express from 'express';
import { AppService } from './app.service';
import { CodeProcessor } from './code.processor';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly codeProcessor: CodeProcessor,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('problems')
  getProblems() {
    return this.codeProcessor.getProblems();
  }
}
 