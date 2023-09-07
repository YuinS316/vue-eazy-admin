import { Module } from '@nestjs/common';
import { CleanExpireJobService } from './clean-expire/clean-expire.job.service';

@Module({
  providers: [CleanExpireJobService],
})
export class JobModule {}
