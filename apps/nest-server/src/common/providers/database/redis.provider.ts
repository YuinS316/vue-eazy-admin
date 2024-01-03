import { getConfig } from '@/utils/config';
import Redis, { RedisOptions } from 'ioredis';

const redisConfig = getConfig('REDIS_CONFIG');

const redisStoreConfig: RedisOptions = {
  host: redisConfig.host,
  port: redisConfig.port,
};

class RedisService {
  private client = new Redis(redisStoreConfig);

  get(key: string) {
    return this.client.get(key);
  }

  //  默认设置一天
  async set(key: string, value: string | number, ttl = redisConfig.ttl) {
    await this.client.set(key, value);

    await this.client.expire(key, ttl);

    return true;
  }

  del(key: string) {
    return this.client.del(key);
  }
}

export const RedisProvider = {
  provide: 'REDIS',
  async useFactory() {
    const client = new RedisService();
    return client;
  },
};
