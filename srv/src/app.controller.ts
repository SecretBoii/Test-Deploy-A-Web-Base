// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CodeProcessor } from './code.processor';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly codeProcessor: CodeProcessor, // ดึง CodeProcessor มาใช้งาน
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 🎯 เติมท่อนี้เข้ามาเพื่อส่งต่อให้ตัวประมวลผลโค้ด และแก้บั๊ก is not a function ตัวตะกี้ครับนศ.!
  @Get('problems')
  getProblems() {
    return this.codeProcessor.getProblems();
  }
}