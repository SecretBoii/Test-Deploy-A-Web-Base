import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class SubmitExerciseDto {
  @IsNotEmpty({ message: 'userId' })
  @IsString()
  userId: string;

  @IsNotEmpty({ message: 'exerciseId' })
  @IsString()
  exerciseId: string;

  @IsNotEmpty({ message: 'sourceCode' })
  @IsString()
  sourceCode: string;

  @IsNotEmpty({ message: 'hintUsed' })
  @IsBoolean()
  hintUsed: boolean;

  @IsOptional()
  @IsString()
  sessionId?: string;
}