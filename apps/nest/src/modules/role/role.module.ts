import { Module } from '@nestjs/common';
import { RoleController } from '@/modules/role/role.controller';
import { RoleService } from '@/modules/role/role.service';
import { PermissionModule } from '@/modules/permission/permission.module';

@Module({
  imports: [PermissionModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
