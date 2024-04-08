import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { appGlobalInit } from '@/modules/app/useGlobal';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  //  全局中间件的入口
  appGlobalInit(app);

  await app.listen(4000);
}
bootstrap();
