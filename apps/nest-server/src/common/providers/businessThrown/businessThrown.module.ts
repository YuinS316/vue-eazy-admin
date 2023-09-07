import { Module } from '@nestjs/common';
import { BusinessThrownService } from './businessThrown.provider';

@Module({
  providers: [BusinessThrownService],
  exports: [BusinessThrownService],
})
export class BusinessThrownModule {}
