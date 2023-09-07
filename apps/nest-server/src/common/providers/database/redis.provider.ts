import { getConfig } from '@/utils/config';
import Redis, { RedisOptions } from 'ioredis';

const redisConfig = getConfig('REDIS_CONFIG');

const redisStoreConfig: RedisOptions = {
  host: redisConfig.host,
  port: redisConfig.port,
};

export const RedisProvider = {
  provide: 'REDIS',
  async useFactory() {
    const client = new Redis(redisStoreConfig);
    return client;
  },
};
