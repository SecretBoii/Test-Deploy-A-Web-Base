import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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
}
