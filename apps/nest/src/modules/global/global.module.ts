import { Global, Module, Logger } from '@nestjs/common';
import { BusinessThrownService } from './providers/businessThrown.provider';
import { DBProvider } from './providers/mysql.provider';
import { ConfigModule } from '@nestjs/config';
import { getConfig } from '@/utils/getConfig';

@Global()
@Module({
  imports: [
    //  环境配置模块
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
  ],
  providers: [BusinessThrownService, DBProvider, Logger],
  exports: [BusinessThrownService, DBProvider, Logger],
})
export class GlobalModule {}
