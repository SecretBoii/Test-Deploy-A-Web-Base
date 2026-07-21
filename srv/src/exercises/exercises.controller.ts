import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { SubmitExerciseDto } from './dto';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post('run')
  async runCode(@Body() submitExerciseDto: SubmitExerciseDto) {
    const { userId, exerciseId, sourceCode, hintUsed } = submitExerciseDto;
    return await this.exercisesService.submitExercise(
      userId,
      exerciseId,
      sourceCode,
      'run',
      hintUsed,
    );
  }

  @Post('submit')
  async submitCode(@Body() submitExerciseDto: SubmitExerciseDto) {
    const { userId, exerciseId, sourceCode, hintUsed } = submitExerciseDto;
    return await this.exercisesService.submitExercise(
      userId,
      exerciseId,
      sourceCode,
      'submit',
      hintUsed,
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
  async getLevelsSummary(@Query('userId') userId?: string) {
    return await this.exercisesService.getLevelsSummary(userId ? Number(userId) : 1);
  }

  // API ดึงข้อมูล Sessions ย่อยทั้งหมดใน Level นั้นๆ พร้อมข้อมูลโจทย์ใน Session (ต้องวางก่อน :id)
  @Get('level-sessions/:level')
  async getLevelSessions(
    @Param('level') level: string,
    @Query('userId') userId?: string,
  ) {
    return await this.exercisesService.getLevelSessions(Number(level), userId ? Number(userId) : 1);
  }

  // API ดึงโจทย์ตาม ID (ต้องวางหลัง static routes)
  @Get(':id')
  async getExerciseById(@Param('id') id: string) {
    return await this.exercisesService.getExerciseById(Number(id));
  }
}
