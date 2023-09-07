import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConfig } from './utils/config';
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { BusinessThrownModule } from './common/providers/businessThrown/businessThrown.module';
import { DatabaseModule } from './common/providers/database/database.module';
import { pinoHttpConfig } from './utils/pinoHttpConfig';
import { JobModule } from './jobs/job.module';
@Module({
  imports: [
    DatabaseModule,
    LoggerModule.forRoot(pinoHttpConfig()),
    ConfigModule.forRoot({
      ignoreEnvFile: true,
      isGlobal: true,
      load: [getConfig],
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    TasksModule,
    BusinessThrownModule,
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
