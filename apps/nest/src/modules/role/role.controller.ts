import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import { RoleService } from '@/modules/role/role.service';
import { CreateRoleDto } from '@/modules/role/dto/create-role.dto';
import {
  AddPermissionToMultipleRolesDto,
  AddRoleToUsersDto,
  AllocPermissionsToRoleDto,
  AllocRolesToUserDto,
} from '@/modules/role/dto/alloc-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get('queryMenuByRole')
  async queryMenuByRole(@Query('code') code: string) {
    return this.roleService.findPermissionsByRoleCode(code);
  }

  @Post('allocRolesToUser')
  async allocRolesToUser(@Body() dto: AllocRolesToUserDto, @Request() req) {
    return this.roleService.allocRolesToUser(
      dto,
      req['user']?.['userName'] || 'unknown',
    );
  }

  @Post('addRoleToMultipleUsers')
  async addRoleToMultipleUsers(@Body() dto: AddRoleToUsersDto, @Request() req) {
    return this.roleService.addRoleToMultipleUsers(
      dto,
      req['user']?.['userName'] || 'unknown',
    );
  }

  @Post('allocPermissionsToRole')
  async allocPermissionsToRole(
    @Body() dto: AllocPermissionsToRoleDto,
    @Request() req,
  ) {
    return this.roleService.allocPermissionsToRole(
      dto,
      req['user']?.['userName'] || 'unknown',
    );
  }

  @Post('addPermissionToMultipleRoles')
  async addPermissionToMultipleRoles(
    @Body() dto: AddPermissionToMultipleRolesDto,
    @Request() req,
  ) {
    return this.roleService.addPermissionToMultipleRoles(
      dto,
      req['user']?.['userName'] || 'unknown',
    );
  }
}
