import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleProvider } from './repository/role.repository';
import { DatabaseModule } from '@/common/providers/database/database.module';
import { BusinessThrownModule } from '@/common/providers/businessThrown/businessThrown.module';

@Module({
  imports: [DatabaseModule, BusinessThrownModule],
  controllers: [RoleController],
  providers: [RoleService, ...RoleProvider],
  exports: [RoleService, ...RoleProvider],
})
export class RoleModule {}
