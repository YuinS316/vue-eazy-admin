import { Controller, Get, Body, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { Public } from '@/common/guards/jwt-auth/public.decorator';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Public()
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.roleService.create(createRoleDto);
  }

  @Get('queryMenuByRole')
  @Public()
  async getRoleByCode(@Query('code') code: string) {
    return await this.roleService.getRoleByCode(code);
  }
}
