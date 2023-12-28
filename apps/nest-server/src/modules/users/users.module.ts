import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from '@/common/providers/database/database.module';
import { UserProviders } from './repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@/utils/jwtConfig';

@Module({
  imports: [DatabaseModule, JwtModule.registerAsync(jwtConfig())],
  controllers: [UsersController],
  providers: [UsersService, ...UserProviders],
})
export class UsersModule {}
