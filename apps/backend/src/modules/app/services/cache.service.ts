import redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private client: redis;

  constructor(configService: ConfigService) {
    const options = {
      host: configService.get('cache.redis.host'),
      port: configService.get('cache.redis.port'),
    };
    this.client = new redis(options);
  }

  public async get(key: string) {
    const value = await this.client.get(key);
    return JSON.parse(value);
  }

  public async set(key: string, time: number, value: any) {
    await this.client.setex(key, time, JSON.stringify(value));
  }

  public async remember<T>(
    key: string,
    time: number,
    callback: () => Promise<T>,
  ): Promise<T> {
    const cachedValue = await this.get(key);
    if (cachedValue) {
      return cachedValue;
    } else {
      const freshValue = await callback();
      await this.set(key, time, freshValue);
      return freshValue;
    }
  }
}
