import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitExerciseDto {
  @IsNotEmpty({ message: 'exerciseId' })
  @IsInt()
  @Type(() => Number)
  exerciseId: number;

  // อนุญาตให้เป็นสตริงว่างได้ (เช่น เมื่อผู้เรียนยังไม่ได้พิมพ์โค้ด) เพื่อให้ Sandbox รันได้ตามปกติ ไม่ติด Error 400
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

export class CreateExerciseDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Topic is required' })
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsNotEmpty({ message: 'Difficulty level is required' })
  @IsInt()
  @Type(() => Number)
  difficultyLevel: number;

  @IsNotEmpty({ message: 'Expected time is required' })
  @IsInt()
  @Type(() => Number)
  expectedTime: number;

  @IsNotEmpty({ message: 'Status is required' })
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  hint?: string;
}

export class UpdateExerciseDto extends CreateExerciseDto {}
