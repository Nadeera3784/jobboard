import redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private client;

  constructor(configService: ConfigService) {
    const options = {
      host: configService.get('cache.redis.host'),
      port: configService.get('cache.redis.port'),
    };
    this.client = new redis(options);
  }

  public async get(key: string, type = 'JSON') {
    const value = await this.client.get(key);
    if (type === 'JSON') {
      return JSON.parse(value);
    }
    return value;
  }

  public async set(key: string, time: number, value: any, type = 'JSON') {
    if (type === 'JSON') {
      value = JSON.stringify(value);
    }
    await this.client.setex(key, time, value);
  }
}
