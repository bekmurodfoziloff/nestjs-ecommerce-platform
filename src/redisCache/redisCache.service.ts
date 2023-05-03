import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache, private readonly configService: ConfigService) {}

  async getValue(key: string): Promise<any> {
    return await this.cache.get(key);
  }

  async setValue(key: string, value: any): Promise<void> {
    await this.cache.set(key, value, this.configService.get('CACHE_TTL'));
  }

  async deleteValue(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async reset(): Promise<void> {
    await this.cache.reset();
  }
}
