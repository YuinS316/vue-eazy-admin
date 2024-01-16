import { PermissionType } from '@/types/permission';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreatePermissionDto {
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @IsString()
  type: PermissionType;

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

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsString()
  @IsOptional()
  redirect?: string;

  @IsString()
  @IsOptional()
  component?: string;

  @IsString()
  @IsOptional()
  layout?: string;

  @IsBoolean()
  @IsOptional()
  keepAlive?: boolean;

  @IsBoolean()
  @IsOptional()
  show?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}
