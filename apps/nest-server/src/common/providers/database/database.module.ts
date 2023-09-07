import { Module } from '@nestjs/common';
import { MysqlProvider } from './mysql.provider';
import { RedisProvider } from './redis.provider';

@Module({
  imports: [],
  providers: [MysqlProvider, RedisProvider],
  exports: [MysqlProvider, RedisProvider],
})
export class DatabaseModule {}
