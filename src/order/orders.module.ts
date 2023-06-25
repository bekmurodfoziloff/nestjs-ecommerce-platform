import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import Order from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisCacheModule } from '../redisCache/redisCache.module';
import { ProductsModule } from '../products/products.module';
import OrderProduct from './entities/orderProduct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderProduct]), RedisCacheModule, ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
