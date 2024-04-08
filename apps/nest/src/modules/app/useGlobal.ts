import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { BaseFilter } from './exceptions/base.filter';
import { HttpFilter } from './exceptions/http.filter';

export const appGlobalInit = (app: INestApplication) => {
  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  //  日志
  app.useLogger(app.get(Logger));

  //  管道
  app.useGlobalPipes(new ValidationPipe());

  //  错误拦截
  app.useGlobalFilters(new BaseFilter(), new HttpFilter());

  //  响应拦截
  app.useGlobalInterceptors(new TransformInterceptor());
};
