import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsDateString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsDateString({}, { message: 'รูปแบบวันเกิดไม่ถูกต้อง' })
  @IsOptional()
  dateOfBirth?: string;

  @IsInt({ message: 'กรุณาระบุสิทธิ์ผู้ใช้งาน' })
  @IsOptional()
  roleId?: number;

  @IsString()
  @IsOptional()
  university?: string;

  @IsString()
  @IsOptional()
  faculty?: string;

  @IsString()
  @IsOptional()
  major?: string;
}
