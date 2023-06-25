import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache, private readonly configService: ConfigService) {}

  async getValue(key: string): Promise<any> {
    const cache: any = await this.cache.get(key);
    return JSON.parse(cache);
  }

  async setValue(
    key: string,
    value: any,
    expire: number = parseInt(this.configService.get('CACHE_TTL'))
  ): Promise<void> {
    await this.cache.set(key, JSON.stringify(value), { ttl: expire } as any);
  }

  async deleteValue(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async reset(): Promise<void> {
    await this.cache.reset();
  }
}
