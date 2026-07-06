import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq'; // 👈 นำเข้า BullModule
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { CodeExecutionProcessor } from './code-execution.processor'; // 👈 นำเข้า Processor

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