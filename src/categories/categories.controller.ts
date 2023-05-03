import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Patch,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { Response } from 'express';
import { CategoriesService } from './categories.service';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import FindOneParams from '../utils/findOneParams';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { PermissionsGuard } from '../authentication/guards/permissions.guard';
import { Permissions } from '../authentication/decorators/permissions.decorator';
import Permission from '../utils/permission.type';
import { RedisCacheService } from '../redisCache/redisCache.service';

@Controller('category')
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly redisCacheService: RedisCacheService
  ) {}

  @Get()
  async getAllCategories(@Res() response: Response) {
    try {
      const cachedCategories = await this.redisCacheService.getValue('categories');
      if (cachedCategories) {
        response.status(HttpStatus.OK).json(JSON.parse(cachedCategories));
      } else {
        const categories = await this.categoriesService.getAllCategories();
        await this.redisCacheService.setValue('categories', JSON.stringify(categories));
        response.status(HttpStatus.OK).json(categories);
      }
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Get(':id')
  async getCategoryById(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const cachedCategory = await this.redisCacheService.getValue(`category:${id}`);
      if (cachedCategory) {
        response.status(HttpStatus.OK).json(JSON.parse(cachedCategory));
      } else {
        const category = await this.categoriesService.getCategoryById(Number(id));
        await this.redisCacheService.setValue(`category:${id}`, JSON.stringify(category));
        response.status(HttpStatus.OK).json(category);
      }
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Post('new')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.CreateCategory)
  async createCategory(
    @Body() categoryData: CreateCategoryDto,
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    try {
      const newCategory = await this.categoriesService.createCategory(categoryData, request.user);
      await this.redisCacheService.setValue(`category:${newCategory.id}`, JSON.stringify(newCategory));
      response.status(HttpStatus.CREATED).json(newCategory);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch(':id/edit')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.UpdateCategory)
  async updateCategory(@Param() { id }: FindOneParams, @Body() category: UpdateCategoryDto, @Res() response: Response) {
    try {
      const updateCategory = await this.categoriesService.updateCategory(Number(id), category);
      await this.redisCacheService.setValue(`category:${id}`, JSON.stringify(updateCategory));
      response.status(HttpStatus.OK).json(updateCategory);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.DeleteCategory)
  async deleteCategory(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const deletedResponse = await this.categoriesService.deleteCategory(Number(id));
      await this.redisCacheService.deleteValue(`category:${id}`);
      response.status(HttpStatus.OK).json(deletedResponse);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }
}
