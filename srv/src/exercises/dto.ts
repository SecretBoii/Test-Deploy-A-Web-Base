import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class SubmitExerciseDto {
  @IsNotEmpty({ message: 'userId ห้ามเป็นค่าว่าง' })
  @IsString()
  userId: string;

  @IsNotEmpty({ message: 'exerciseId ห้ามเป็นค่าว่าง' })
  @IsString()
  exerciseId: string;

  @IsNotEmpty({ message: 'sourceCode ห้ามเป็นค่าว่าง' })
  @IsString()
  sourceCode: string;

  @IsNotEmpty({ message: 'hintUsed ห้ามเป็นค่าว่าง' })
  @IsBoolean()
  hintUsed: boolean;
}