import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { TransformInterceptor } from '@common/interceptors/transform/transform.interceptor';
import { BaseFilter } from '@common/exceptions/base/base.filter';
import { HttpFilter } from '@common/exceptions/http/http.filter';
import { generateDocument } from './utils/genDoc';
import { getConfig } from '@/utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  //  session配置
  const sessionConfig = getConfig('SESSION');
  app.use(
    session({
      ...sessionConfig,
      rolling: true,
      resave: false,
      saveUninitialized: true,
    }),
  );

  //  使用pino作为日志输出组件
  app.useLogger(app.get(Logger));
  app.flushLogs();

  app.setGlobalPrefix('/api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  //  错误捕获
  app.useGlobalFilters(new BaseFilter(), new HttpFilter());

  //  响应拦截
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(new ValidationPipe());

  //  生成swagger文档
  generateDocument(app);

  await app.listen(3000);

  console.log(`🚀 bootstrap successfully: http://localhost:3000`);
}
bootstrap();
