import {
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  Res,
  HttpStatus,
  Body,
  Patch,
  Delete
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { CartsService } from './carts.service';
import { RedisCacheService } from '../redisCache/redisCache.service';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import AddOrderProductToCart from './dto/addOrderProductToCart.dto';
import EditOrderProductDto from './dto/editOrderProduct.dto';
import RemoveOrderProductFromCart from './dto/removeOrderProductFromCart.dto';
import { Roles } from '../authentication/decorators/roles.decorator';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Role } from '../utils/enums/role.enum';
import CartNotFoundException from './exceptions/cartNotFound.exception';

@Controller('cart')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.User)
@UseInterceptors(ClassSerializerInterceptor)
export class CartsController {
  constructor(
    private readonly cartsService: CartsService,
    private readonly redisCacheService: RedisCacheService,
    protected readonly configService: ConfigService
  ) {}

  @Get()
  async getCart(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const cachedCart = await this.redisCacheService.getValue(`cartCustomerId:${request.user.id}`);
      const cart = request.cookies.cart || cachedCart;
      if (cart) {
        response.status(HttpStatus.OK).json(cart);
      }
      throw new CartNotFoundException();
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Post('add')
  async addOrderProductToCart(
    @Body() cartData: AddOrderProductToCart,
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    try {
      const cachedCart = await this.redisCacheService.getValue(`cartCustomerId:${request.user.id}`);
      const cart = request.cookies.cart || cachedCart;
      const newCart = await this.cartsService.addOrderProductToCart(cart, request.user, cartData);
      await this.redisCacheService.setValue(
        `cartCustomerId:${request.user.id}`,
        newCart,
        parseInt(this.configService.get('LONG_CACHE_TTL'))
      );
      response.cookie('cart', newCart, { httpOnly: true, secure: true });
      response.status(HttpStatus.CREATED).json(newCart);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Patch('edit')
  async editOrderProduct(
    @Body() cartData: EditOrderProductDto,
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    try {
      const cachedCart = await this.redisCacheService.getValue(`cartCustomerId:${request.user.id}`);
      const cart = request.cookies.cart || cachedCart;
      const updatedOrderProduct = await this.cartsService.editOrderProduct(cart, cartData);
      await this.redisCacheService.setValue(
        `cartCustomerId:${request.user.id}`,
        updatedOrderProduct,
        parseInt(this.configService.get('LONG_CACHE_TTL'))
      );
      response.cookie('cart', updatedOrderProduct, { httpOnly: true, secure: true });
      response.status(HttpStatus.OK).json(updatedOrderProduct);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Delete('remove')
  async removeOrderProductFromCart(
    @Body() cartData: RemoveOrderProductFromCart,
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    try {
      const cachedCart = await this.redisCacheService.getValue(`cartCustomerId:${request.user.id}`);
      const cart = request.cookies.cart || cachedCart;
      const deletedOrderProduct = await this.cartsService.removeOrderProductFromCart(cart, cartData);
      await this.redisCacheService.setValue(
        `cartCustomerId:${request.user.id}`,
        deletedOrderProduct,
        parseInt(this.configService.get('LONG_CACHE_TTL'))
      );
      response.cookie('cart', deletedOrderProduct, { httpOnly: true, secure: true });
      response.status(HttpStatus.OK).json(deletedOrderProduct);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
}
