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
    //  环境配置模块
    // ConfigModule.forRoot({
    //   ignoreEnvFile: true,
    //   isGlobal: true,
    //   load: [getConfig],
    // }),
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
    //  全局共享
    GlobalModule,
    //  业务模块
    UserModule,
    AuthModule,
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
