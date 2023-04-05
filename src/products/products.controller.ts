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
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/createProduct.dto';
import UpdateProductDto from './dto/updateProduct.dto';
import FilterProductDto from './dto/filterProduct.dto';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import FindOneParams from '../utils/findOneParams';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';

@Controller('product')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() filterProductData: FilterProductDto, @Res() response: Response) {
    try {
      if (Object.keys(filterProductData).length) {
        const filteredProducts = await this.productsService.getFilteredProducts(filterProductData);
        response.status(HttpStatus.OK).json(filteredProducts);
      } else {
        const products = await this.productsService.getAllProducts();
        response.status(HttpStatus.OK).json(products);
      }
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Get(':id')
  async getProductById(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const product = await this.productsService.getProductById(Number(id));
      response.status(HttpStatus.OK).json(product);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Post('new')
  @UseGuards(JwtAuthenticationGuard)
  async createProduct(
    @Body() productData: CreateProductDto,
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    try {
      const newProduct = await this.productsService.createProduct(productData, request.user);
      response.status(HttpStatus.CREATED).json(newProduct);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch(':id/edit')
  @UseGuards(JwtAuthenticationGuard)
  async updateProduct(
    @Param() { id }: FindOneParams,
    @Body() productData: UpdateProductDto,
    @Res() response: Response
  ) {
    try {
      const updatedProduct = await this.productsService.updateProduct(Number(id), productData);
      response.status(HttpStatus.OK).json(updatedProduct);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard)
  async deleteProduct(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const deletedProduct = await this.productsService.deleteProduct(Number(id));
      response.status(HttpStatus.OK).json(deletedProduct);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }
}
