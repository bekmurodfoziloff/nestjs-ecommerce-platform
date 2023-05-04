import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { ProductsModule } from '../products/products.module';
import { RedisCacheModule } from '../redisCache/redisCache.module';

@Module({
  imports: [ProductsModule, RedisCacheModule],
  providers: [CartsService],
  controllers: [CartsController]
})
export class CartsModule {}
