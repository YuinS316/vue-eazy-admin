import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Role } from '@/modules/role/entities/role.entity';

export class UpdateUserDto {
  @IsNumber()
  id: number;

  @IsArray()
  @IsOptional()
  roles: Role[];
}
