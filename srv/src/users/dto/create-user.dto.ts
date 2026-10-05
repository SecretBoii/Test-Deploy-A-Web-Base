import { IsString, IsEmail, IsNotEmpty, IsOptional, IsInt, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอก Username' })
  username: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อจริง' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกนามสกุล' })
  lastName: string;

  @IsEmail({}, { message: 'รูปแบบอีเมลไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'กรุณากรอกอีเมล' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุเพศ' })
  gender: string;

  @IsDateString({}, { message: 'รูปแบบวันเกิดไม่ถูกต้อง' })
  @IsNotEmpty({ message: 'กรุณากรอกวันเกิด' })
  dateOfBirth: string;

  @IsInt({ message: 'กรุณาระบุสิทธิ์ผู้ใช้งาน' })
  @IsNotEmpty()
  roleId: number;

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
