import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile
} from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import UpdateProductDto from './dto/updateProduct.dto';
import FilterProductDto from './dto/filterProduct.dto';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import FindOneParams from '../utils/findOneParams';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { PermissionsGuard } from '../authentication/guards/permissions.guard';
import { Permissions } from '../authentication/decorators/permissions.decorator';
import Permission from '../utils/permission.type';
import LocalFilesInterceptor from '../utils/localFiles.interceptor';
import UpdateInvertoryDto from './dto/updateInvertory.dto';
import { RedisCacheService } from '../redisCache/redisCache.service';
import UpdateCategoriesDto from './dto/updateCategories.dto';

@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly redisCacheService: RedisCacheService
  ) {}

  @Get()
  async getProducts(@Query() filterProductData: FilterProductDto, @Res() response: Response) {
    try {
      if (Object.keys(filterProductData).length) {
        const filteredProducts = await this.productsService.getFilteredProducts(filterProductData);
        response.status(HttpStatus.OK).json(filteredProducts);
      } else {
        const cachedProducts = await this.redisCacheService.getValue('products');
        if (cachedProducts && !filterProductData.page) {
          response.status(HttpStatus.OK).json(cachedProducts);
        } else {
          const products = await this.productsService.getAllProducts(filterProductData.page);
          await this.redisCacheService.setValue('products', products);
          response.status(HttpStatus.OK).json(products);
        }
      }
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Get(':id')
  async getProductById(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const cachedProduct = await this.redisCacheService.getValue(`product:${id}`);
      if (cachedProduct) {
        response.status(HttpStatus.OK).json(cachedProduct);
      } else {
        const product = await this.productsService.getProductById(Number(id));
        await this.redisCacheService.setValue(`product:${id}`, product);
        response.status(HttpStatus.OK).json(product);
      }
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Post('new')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.CreateProduct)
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'imageURL',
      path: '/productImages',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(new BadRequestException('Provide a valid image'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: Math.pow(1024, 2) * 2 // 2MB
      }
    })
  )
  async createProduct(
    @Body() productData: CreateProductDto,
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const newProduct = await this.productsService.createProduct(productData, request.user, file.path);
      await this.redisCacheService.setValue(`product:${newProduct.id}`, newProduct);
      response.status(HttpStatus.CREATED).json(newProduct);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Patch(':id/edit')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.UpdateProduct)
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'imageURL',
      path: '/productImages',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(new BadRequestException('Provide a valid image'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: Math.pow(1024, 2) * 2 // 2MB
      }
    })
  )
  async updateProduct(
    @Param() { id }: FindOneParams,
    @Body() productData: UpdateProductDto,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      const updatedProduct = await this.productsService.updateProduct(Number(id), productData, file.path);
      await this.redisCacheService.setValue(`product:${id}`, updatedProduct);
      response.status(HttpStatus.OK).json(updatedProduct);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.DeleteProduct)
  async deleteProduct(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const deletedResponse = await this.productsService.deleteProduct(Number(id));
      await this.redisCacheService.deleteValue(`product:${id}`);
      response.status(HttpStatus.OK).json(deletedResponse);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Patch(':id/inventory/edit')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.UpdateInventory)
  async updateInvertory(
    @Param() { id }: FindOneParams,
    @Body() inventoryData: UpdateInvertoryDto,
    @Res() response: Response
  ) {
    try {
      const updatedProduct = await this.productsService.updateInvertory(Number(id), inventoryData);
      await this.redisCacheService.setValue(`product:${id}`, updatedProduct);
      response.status(HttpStatus.OK).json(updatedProduct);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Patch(':id/categories/edit')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.UpdateInventory)
  async updateCategories(
    @Param() { id }: FindOneParams,
    @Body() categoriesData: UpdateCategoriesDto,
    @Res() response: Response
  ) {
    try {
      const updatedProduct = await this.productsService.updateCategories(Number(id), categoriesData);
      await this.redisCacheService.setValue(`product:${id}`, updatedProduct);
      response.status(HttpStatus.OK).json(updatedProduct);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
}
