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
  Query,
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
  async getAllCategories(@Query('page') page: number, @Res() response: Response) {
    try {
      const cachedCategories = await this.redisCacheService.getValue('categories');
      if (cachedCategories && !page) {
        response.status(HttpStatus.OK).json(cachedCategories);
      } else {
        const categories = await this.categoriesService.getAllCategories(page);
        await this.redisCacheService.setValue('categories', categories);
        response.status(HttpStatus.OK).json(categories);
      }
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Get(':id')
  async getCategoryById(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const cachedCategory = await this.redisCacheService.getValue(`category:${id}`);
      if (cachedCategory) {
        response.status(HttpStatus.OK).json(cachedCategory);
      } else {
        const category = await this.categoriesService.getCategoryById(Number(id));
        await this.redisCacheService.setValue(`category:${id}`, category);
        response.status(HttpStatus.OK).json(category);
      }
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
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
      await this.redisCacheService.setValue(`category:${newCategory.id}`, newCategory);
      response.status(HttpStatus.CREATED).json(newCategory);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Patch(':id/edit')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.UpdateCategory)
  async updateCategory(
    @Param() { id }: FindOneParams,
    @Body() categoryData: UpdateCategoryDto,
    @Res() response: Response
  ) {
    try {
      const updatedCategory = await this.categoriesService.updateCategory(Number(id), categoryData);
      await this.redisCacheService.setValue(`category:${id}`, updatedCategory);
      response.status(HttpStatus.OK).json(updatedCategory);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
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
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
}
