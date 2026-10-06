import {
  IsString,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsIn,
  IsArray,
  IsOptional,
} from 'class-validator';

/**
 * DTO สำหรับแก้ไข Session รองรับการอัปเดตเฉพาะบางฟิลด์
 */
export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'ชื่อ Session ต้องไม่เกิน 100 ตัวอักษร' })
  sessionName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'จุดประสงค์ต้องไม่เกิน 100 ตัวอักษร' })
  sessionObjective?: string;

  @IsOptional()
  @IsInt({ message: 'ระดับความยากต้องเป็นจำนวนเต็ม' })
  @Min(1, { message: 'ระดับความยากต่ำสุดคือ 1' })
  @Max(5, { message: 'ระดับความยากสูงสุดคือ 5' })
  targetLevel?: number;

  @IsOptional()
  @IsInt({ message: 'ระยะเวลาต้องเป็นตัวเลขนาที' })
  @Min(1, { message: 'ระยะเวลาต้องมากกว่า 0 นาที' })
  duration?: number;

  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'สถานะต้องเป็น active หรือ inactive เท่านั้น',
  })
  status?: string;

  @IsOptional()
  @IsArray({ message: 'exerciseIds ต้องเป็น Array ของรหัสโจทย์' })
  @IsInt({ each: true, message: 'รหัสโจทย์ใน exerciseIds ต้องเป็นตัวเลข' })
  exerciseIds?: number[];
}
