import { IsArray, IsNumber, IsString } from 'class-validator';

//  给单个用户分配多个角色
export class AllocRolesToUserDto {
  @IsArray()
  roleCodeList: string[];

  @IsString()
  userName: string;
}

//  给多个用户分配单个角色
export class AllocRoleToUsersDto {
  @IsString()
  roleCode: string;

  @IsArray()
  userNameList: string[];
}
