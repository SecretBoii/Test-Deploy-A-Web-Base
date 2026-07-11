import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { CodeExecutionProcessor } from './code-execution.processor';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'code-execution',
    }),
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService, CodeExecutionProcessor],
})
export class ExercisesModule {}