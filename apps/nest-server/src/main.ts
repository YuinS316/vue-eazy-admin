import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { TransformInterceptor } from '@common/interceptors/transform/transform.interceptor';
import { BaseFilter } from '@common/exceptions/base/base.filter';
import { HttpFilter } from '@common/exceptions/http/http.filter';
import { generateDocument } from './utils/genDoc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

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
}
bootstrap();
