import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Public } from '@/common/guards/jwt-auth/public.decorator';
import {
  AllocRolesToUserDto,
  AllocRoleToUsersDto,
} from '@/modules/role/dto/alloc-user-role.dto';
import { BUSINESS_ERROR_CODE } from '@common/providers/businessThrown/business.code.enum';
import { BusinessThrownService } from '@common/providers/businessThrown/businessThrown.provider';

@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    @Inject(BusinessThrownService)
    private thrownService: BusinessThrownService,
  ) {}

  @Post()
  @Public()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  @Get('queryMenuByRole')
  @Public()
  async getRoleByCode(@Query('code') code: string) {
    const res = await this.roleService.getRoleByCode(code);
    if (!res) {
      this.thrownService.throwError(BUSINESS_ERROR_CODE.ROLE_NOT_EXIST);
    } else {
      return res;
    }
  }

  @Post('allocRolesToUser')
  @Public()
  async allocUsersToRole(@Body() allocUserRoleDto: AllocRolesToUserDto) {
    const res = await this.roleService.allocRolesToUser(allocUserRoleDto);

    return res;
  }

  @Post('allocRoleToMultipleUsers')
  @Public()
  async allocRoleToMultipleUsers(
    @Body() allocRoleToUsersDto: AllocRoleToUsersDto,
  ) {
    const res = await this.roleService.allocRoleToMultipleUsers(
      allocRoleToUsersDto,
    );

    return res;
  }
}
