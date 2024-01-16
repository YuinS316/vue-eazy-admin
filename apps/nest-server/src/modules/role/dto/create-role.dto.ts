import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  enable?: boolean;

  @IsString()
  createdBy: string;

  @IsString()
  updatedBy: string;

  @IsArray()
  permissionIdList: number[];
}
