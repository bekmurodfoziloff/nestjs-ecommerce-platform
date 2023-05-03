import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import Category from './category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsUniqueCategoryNameValidator } from '../validators/IsUniqueCategoryName.validator';
import { RedisCacheModule } from '../redisCache/redisCache.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), RedisCacheModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, IsUniqueCategoryNameValidator]
})
export class CategoriesModule {}
