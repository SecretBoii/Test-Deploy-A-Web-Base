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
    const { exerciseId, sourceCode, hintUsed, sessionId, runCount } = submitExerciseDto;
    return await this.exercisesService.submitExercise(
      user.userId,
      exerciseId,
      sourceCode,
      'run',
      hintUsed,
      sessionId,
      runCount,
    );
  }

  @Post('submit')
  async submitCode(
    @Body() submitExerciseDto: SubmitExerciseDto,
    @CurrentUser() user: any,
    ) {
    const { exerciseId, sourceCode, hintUsed, sessionId, runCount } = submitExerciseDto;
    return await this.exercisesService.submitExercise(
      user.userId,
      exerciseId,
      sourceCode,
      'submit',
      hintUsed,
      sessionId,
      runCount,
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

  @Get('recent-session')
  async getRecentSession(@CurrentUser() user: any) {
    return await this.exercisesService.getRecentSession(user.userId);
  }

  // API ดึงความก้าวหน้าสรุปของแต่ละ Level (ต้องวางก่อน :id)
  @Get('levels-summary')
  async getLevelsSummary(@CurrentUser() user: any) {
    return await 
    this.exercisesService.getLevelsSummary(user.userId);
  }

  @Get('dashboard-stats')
  async getDashboardStats(@CurrentUser() user: any) {
    return await this.exercisesService.getDashboardStats(user.userId);
  }

  @Get('history')
  async getHistory(@CurrentUser() user: any, @Query('limit')limit?: string) {
    const limitNum = limit ? Number(limit) : undefined;
    return await this.exercisesService.getHistory(user.userId, limitNum);
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
