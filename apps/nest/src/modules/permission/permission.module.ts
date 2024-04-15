import { Module } from '@nestjs/common';
import { PermissionController } from '@/modules/permission/permission.controller';
import { PermissionService } from '@/modules/permission/permission.service';

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
