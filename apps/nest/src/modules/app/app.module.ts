import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { getConfig } from '@/utils/getConfig';
import { GlobalModule } from '@/modules/global/global.module';
import { UserModule } from '@/modules/user/user.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AuthModule } from '@/modules/auth/auth.module';
import pino, { Level, multistream } from 'pino';
import pretty from 'pino-pretty';
import { join } from 'path';
import * as dayjs from 'dayjs';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/modules/app/guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@/utils/jwtConfig';
import { PermissionModule } from '@/modules/permission/permission.module';
import { RoleModule } from '@/modules/role/role.module';

@Module({
  imports: [
    //  日志模块设置
    LoggerModule.forRoot({
      pinoHttp: [
        {
          serializers: {
            req(req) {
              req.body = req.raw.body;
              return req;
            },
          },
        },
        multistream(
          [
            // 控制台输出
            ...(['info', 'debug', 'warn', 'error', 'fatal'] as Level[]).map(
              (level) => ({
                level,
                stream: process.stdout.pipe(pretty()),
              }),
            ),
            // 写入日志
            ...(['debug', 'error', 'fatal'] as Level[]).map((level) => ({
              level,
              stream: pino.transport({
                target: 'pino-roll',
                options: {
                  file: join('logs', dayjs().format('YYYY-MM-DD')),
                  frequency: 'daily',
                  mkdir: true,
                  size: '10m',
                  extension: '.json',
                },
              }),
            })),
          ],
          { dedupe: true },
        ),
      ],
    }),
    //  redis模块
    RedisModule.forRootAsync({
      useFactory() {
        const redisConfig = getConfig('REDIS_CONFIG');
        return {
          type: 'single',
          url: `redis://${redisConfig.host}:${redisConfig.port}`,
          options: {},
        };
      },
    }),
    JwtModule.registerAsync(jwtConfig()),
    //  全局共享
    GlobalModule,
    //  业务模块
    UserModule,
    AuthModule,
    PermissionModule,
    RoleModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
