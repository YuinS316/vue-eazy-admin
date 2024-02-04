import { Controller, Post, Body, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Public } from '@/common/guards/jwt-auth/public.decorator';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Get('getMenuPermission')
  async getMenuPermission() {
    return this.permissionService.getMenuPermission();
  }
}
