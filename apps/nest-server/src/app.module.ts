import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConfig } from './utils/config';
import { UsersModule } from './modules/users/users.module';
import { BusinessThrownModule } from './common/providers/businessThrown/businessThrown.module';
import { DatabaseModule } from './common/providers/database/database.module';
import { pinoHttpConfig } from './utils/pinoHttpConfig';
import { JobModule } from './jobs/job.module';
import { JwtAuthGuard } from './common/guards/jwt-auth/jwt-auth.guard';
import { jwtConfig } from './utils/jwtConfig';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [
    //  数据库
    DatabaseModule,
    //  日志
    LoggerModule.forRoot(pinoHttpConfig()),
    //  配置
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    //  jwt的签证
    JwtModule.registerAsync(jwtConfig()),
    //  定时任务
    ScheduleModule.forRoot(),
    JobModule,
    //  统一业务报错
    BusinessThrownModule,
    //  ======== 业务模块 ========
    UsersModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //  全局jwt拦截
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
