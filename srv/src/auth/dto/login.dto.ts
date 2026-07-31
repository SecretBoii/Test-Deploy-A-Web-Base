import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'กรุณากรอก Username' })
  @IsString({ message: 'Username ต้องเป็นข้อความ' })
  username: string;

  @IsNotEmpty({ message: 'กรุณากรอก Password' })
  @IsString({ message: 'Password ต้องเป็นข้อความ' })
  password: string;
}
