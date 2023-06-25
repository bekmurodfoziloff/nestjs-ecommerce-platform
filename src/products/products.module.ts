import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { IsUniqueProductNameValidator } from '../validators/IsUniqueProductName.validator';
import Inventory from './entities/inventory.entity';
import { RedisCacheModule } from '../redisCache/redisCache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Inventory]), RedisCacheModule],
  controllers: [ProductsController],
  providers: [ProductsService, IsUniqueProductNameValidator],
  exports: [ProductsService]
})
export class ProductsModule {}
