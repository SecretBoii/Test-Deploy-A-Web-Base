import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitExerciseDto {
  @IsNotEmpty({ message: 'exerciseId' })
  @IsInt()
  @Type(() => Number)
  exerciseId: number;

  @IsNotEmpty({ message: 'sourceCode' })
  @IsString()
  sourceCode: string;

  @IsNotEmpty({ message: 'hintUsed' })
  @IsBoolean()
  hintUsed: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  sessionId?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  runCount?: number;
}