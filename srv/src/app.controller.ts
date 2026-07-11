import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CodeProcessor } from './code.processor';

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

  @Get('problems')
  getProblems() {
    return this.codeProcessor.getProblems();
  }
}