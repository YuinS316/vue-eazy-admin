import { IsArray, IsNumber, IsString } from 'class-validator';

//  给单个用户分配多个角色
export class AllocRolesToUserDto {
  @IsArray()
  roleCodeList: string[];

  @IsString()
  userName: string;
}

//  给多个用户添加单个角色
export class AddRoleToUsersDto {
  @IsString()
  roleCode: string;

  @IsArray()
  userNameList: string[];
}

//  给单个角色分配多个权限
export class AllocPermissionsToRoleDto {
  @IsArray()
  permissionCodeList: string[];

  @IsString()
  roleCode: string;
}

//  给多个角色添加同个权限
export class AddPermissionToMultipleRolesDto {
  @IsString()
  permissionCode: string;

  @IsArray()
  roleCodeList: string[];
}
