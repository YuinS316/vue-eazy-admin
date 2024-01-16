import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { PermissionProviders } from './repository/permission.reposity';
import { DatabaseModule } from '@/common/providers/database/database.module';
import { BusinessThrownModule } from '@/common/providers/businessThrown/businessThrown.module';

@Module({
  imports: [DatabaseModule, BusinessThrownModule],
  controllers: [PermissionController],
  providers: [PermissionService, ...PermissionProviders],
})
export class PermissionModule {}
