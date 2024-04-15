import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { PermissionService } from '@/modules/permission/permission.service';
import { CreatePermissionDto } from '@/modules/permission/dto/create-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() dto: CreatePermissionDto) {
    return this.permissionService.create(dto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.permissionService.delete(id);
  }

  @Get('getMenuPermission')
  async getMenuPermission(@Query('name') name: string) {
    return this.permissionService.getMenuPermissionByName(name);
  }
}
