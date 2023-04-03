import { Module } from '@nestjs/common';
import CategoriesController from './categories.controller';
import CategoriesService from './categories.service';
import Category from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueCategoryNameValidator } from '../validators/IsUniqueCategoryName.validator';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService, IsUniqueCategoryNameValidator]
})
export class CategoriesModule {}
