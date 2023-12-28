import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @Length(3, 30)
  @ApiProperty({ example: 'alan', description: '登录的用户名' })
  userName: string;

  @IsString()
  @Length(6, 30)
  @ApiProperty({ example: 'ddd123', description: '加密后的密码' })
  password: string;
}
