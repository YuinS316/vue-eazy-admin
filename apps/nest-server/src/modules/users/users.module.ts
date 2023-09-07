import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@/common/providers/database/database.module';
import { UserProviders } from './repository/user.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, ...UserProviders],
})
export class UsersModule {}
