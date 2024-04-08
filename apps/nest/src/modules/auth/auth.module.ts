import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@/utils/jwtConfig';

@Module({
  imports: [UserModule, JwtModule.registerAsync(jwtConfig())],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
