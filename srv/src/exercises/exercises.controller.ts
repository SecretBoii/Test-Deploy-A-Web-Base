import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { SubmitExerciseDto } from './dto';

@Controller('exercises') // พาธหลัก: http://localhost:3000/exercises
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post('run') // ท่อยิง: POST http://localhost:3000/exercises/run
  async runCode(@Body() submitExerciseDto: SubmitExerciseDto) {
    const { userId, exerciseId, sourceCode, hintUsed } = submitExerciseDto;
    return await this.exercisesService.submitExercise(userId, exerciseId, sourceCode, 'run', hintUsed);
  }

  @Post('submit') // ท่อยิง: POST http://localhost:3000/exercises/submit
  async submitCode(@Body() submitExerciseDto: SubmitExerciseDto) {
    const { userId, exerciseId, sourceCode, hintUsed } = submitExerciseDto;
    return await this.exercisesService.submitExercise(userId, exerciseId, sourceCode, 'submit', hintUsed);
  }

  @Get('status/:activityId') // ท่อยิง: GET http://localhost:3000/exercises/status/:activityId
  async getStatus(@Param('activityId') activityId: string) {
    return await this.exercisesService.getStatus(Number(activityId));
  }
}