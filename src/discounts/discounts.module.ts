import { Module } from '@nestjs/common';
import DiscountsController from './discounts.controller';
import DiscountsService from './discounts.service';
import Discount from './discounts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueDiscountNameValidator } from 'src/validators/IsUniqueDiscountName.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  controllers: [DiscountsController],
  providers: [DiscountsService, IsUniqueDiscountNameValidator]
})
export class DiscountsModule {}
