import { Module } from '@nestjs/common';
import { DiscountsController } from './discounts.controller';
import { DiscountsService } from './discounts.service';
import Discount from './discounts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueDiscountNameValidator } from '../validators/IsUniqueDiscountName.validator';
import { RedisCacheModule } from '../redisCache/redisCache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discount]), RedisCacheModule],
  controllers: [DiscountsController],
  providers: [DiscountsService, IsUniqueDiscountNameValidator]
})
export class DiscountsModule {}
