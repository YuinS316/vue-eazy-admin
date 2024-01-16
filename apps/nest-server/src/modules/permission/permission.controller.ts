import { Controller, Post, Body, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Public } from '@/common/guards/jwt-auth/public.decorator';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @Public()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.create(createPermissionDto);
  }

  @Get('menuTree')
  @Public()
  async getMenuTree() {
    return await this.permissionService.getMenuTree();
  }
}
