import { IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @IsNotEmpty({ message: 'กรุณากรอก Username' })
  @IsString({ message: 'Username ต้องเป็นข้อความ' })
  username: string;

  @IsNotEmpty({ message: 'กรุณากรอก Password' })
  @IsString({ message: 'Password ต้องเป็นข้อความ' })
  password: string;

  @IsNotEmpty({ message: 'กรุณาระบุเพศ' })
  @IsString({ message: 'เพศต้องเป็นข้อความ' })
  gender: string;

  @IsNotEmpty({ message: 'กรุณาระบุวันเกิด' })
  @IsString({ message: 'วันเกิดต้องเป็นข้อความ' })
  dateOfBirth: string;

  @IsNotEmpty({ message: 'กรุณากรอกมหาวิทยาลัย' })
  @IsString({ message: 'มหาวิทยาลัยต้องเป็นข้อความ' })
  university: string;

  @IsNotEmpty({ message: 'กรุณากรอกคณะ' })
  @IsString({ message: 'คณะต้องเป็นข้อความ' })
  faculty: string;

  @IsNotEmpty({ message: 'กรุณากรอกสาขา' })
  @IsString({ message: 'สาขาต้องเป็นข้อความ' })
  major: string;
}
