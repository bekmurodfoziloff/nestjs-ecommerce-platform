import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from './product.entity';
import ProductsController from './products.controller';
import ProductsService from './products.service';
import { IsUniqueProductNameValidator } from '../validators/IsUniqueProductName.validator';
import { ConfigModule } from '@nestjs/config';
import Inventory from './inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Inventory]), ConfigModule],
  controllers: [ProductsController],
  providers: [ProductsService, IsUniqueProductNameValidator]
})
export class ProductsModule {}
