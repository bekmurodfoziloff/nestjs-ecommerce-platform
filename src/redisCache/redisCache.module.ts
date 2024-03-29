import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redisCache.service';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync<any>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT')
          }
          // ttl: parseInt(configService.get('CACHE_TTL'))
        });
        return {
          store: () => store
        };
      },
      inject: [ConfigService]
    }),
    ConfigModule
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService, ConfigModule]
})
export class RedisCacheModule {}
