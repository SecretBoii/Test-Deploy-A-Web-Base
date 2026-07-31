import { Controller, Post, Body, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { SubmitExerciseDto } from './dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user-decorator';
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post('run')
  async runCode(
    @Body() submitExerciseDto: SubmitExerciseDto,
    @CurrentUser() user: any, 
    ) {
    const { exerciseId, sourceCode, hintUsed, sessionId } = submitExerciseDto;
    return await this.exercisesService.submitExercise(
      user.userId,
      exerciseId,
      sourceCode,
      'run',
      hintUsed,
      sessionId,
    );
  }

  @Post('submit')
  async submitCode(
    @Body() submitExerciseDto: SubmitExerciseDto,
    @CurrentUser() user: any,
    ) {
    const { exerciseId, sourceCode, hintUsed, sessionId } = submitExerciseDto;
    return await this.exercisesService.submitExercise(
      user.userId,
      exerciseId,
      sourceCode,
      'submit',
      hintUsed,
      sessionId,
    );
  }

  @Get('test-skills')
  async testSkills() {
    return this.exercisesService.getLoadedSkills();
  }

  @Get('status/:activityId')
  async getStatus(@Param('activityId') activityId: string) {
    return await this.exercisesService.getStatus(Number(activityId));
  }

  // API ดึงความก้าวหน้าสรุปของแต่ละ Level (ต้องวางก่อน :id)
  @Get('levels-summary')
  async getLevelsSummary(@CurrentUser() user: any) {
    return await 
    this.exercisesService.getLevelsSummary(user.userId);
  }

  // API ดึงข้อมูล Sessions ย่อยทั้งหมดใน Level นั้นๆ พร้อมข้อมูลโจทย์ใน Session (ต้องวางก่อน :id)
  @Get('level-sessions/:level')
  async getLevelSessions(
    @Param('level') level: string,
    @CurrentUser() user: any,
  ) {
    return await this.exercisesService.getLevelSessions(Number(level), user.userId);
  }

  // API ดึงโจทย์ตาม ID (ต้องวางหลัง static routes)
  @Get(':id')
  async getExerciseById(@Param('id') id: string) {
    return await this.exercisesService.getExerciseById(Number(id));
  }
}
