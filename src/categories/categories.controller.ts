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
import CategoriesService from './categories.service';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import FindOneParams from '../utils/findOneParams';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { Role } from '../utils/role.enum';

@Controller('category')
@UseInterceptors(ClassSerializerInterceptor)
export default class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(@Res() response: Response) {
    try {
      const categories = await this.categoriesService.getAllCategories();
      response.status(HttpStatus.OK).json(categories);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Get(':id')
  async getCategoryById(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const category = await this.categoriesService.getCategoriesById(Number(id));
      response.status(HttpStatus.OK).json(category);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Post('new')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.Admin)
  async createCategory(
    @Body() categoryData: CreateCategoryDto,
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    try {
      const newCategory = await this.categoriesService.createCategory(categoryData, request.user);
      response.status(HttpStatus.CREATED).json(newCategory);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch(':id/edit')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.Admin)
  async updateCategory(@Param() { id }: FindOneParams, @Body() category: UpdateCategoryDto, @Res() response: Response) {
    try {
      const updateCategory = await this.categoriesService.updateCategory(Number(id), category);
      response.status(HttpStatus.OK).json(updateCategory);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.Admin)
  async deleteCategory(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const deleteCategory = await this.categoriesService.deleteCategory(Number(id));
      response.status(HttpStatus.OK).json(deleteCategory);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }
}
