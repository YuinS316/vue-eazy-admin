import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(6, 30)
  @ApiProperty({ example: 'alan' })
  userName: string;

  @IsString()
  @Length(6, 30)
  @ApiProperty({ example: 'ddd123' })
  password: string;

  @IsString()
  @Length(6, 30)
  @ApiProperty({ example: 'ddd123' })
  confirmPassword: string;
}
