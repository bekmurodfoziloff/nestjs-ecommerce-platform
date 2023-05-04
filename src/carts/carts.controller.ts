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
  Param,
  ParseIntPipe,
  Delete
} from '@nestjs/common';
import { Response } from 'express';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { CartsService } from './carts.service';
import { RedisCacheService } from '../redisCache/redisCache.service';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import CreateCartDto from './dto/createCart.dto';
import UpdateCartDto from './dto/updateCart.dto';

@Controller('cart')
@UseGuards(JwtAuthenticationGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CartsController {
  constructor(private readonly cartsService: CartsService, private readonly redisCacheService: RedisCacheService) {}

  @Get()
  async getCart(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const cachedCart = await this.redisCacheService.getValue('cart');
      const cart = request.cookies.cart || JSON.parse(cachedCart ? cachedCart : null) || [];
      const cartItems = await this.cartsService.getcart(cart);
      response.status(HttpStatus.OK).json(cartItems);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Post('new')
  async createCart(@Body() cartData: CreateCartDto, @Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const { productId, quantity } = cartData;
      const cachedCart = await this.redisCacheService.getValue('cart');
      const cart = request.cookies.cart || JSON.parse(cachedCart ? cachedCart : null) || [];
      const newCart = await this.cartsService.createCart(cart, productId, quantity);
      await this.redisCacheService.setValue('cart', JSON.stringify(newCart));
      response.cookie('cart', newCart, { httpOnly: true, secure: true });
      response.status(HttpStatus.CREATED).json(newCart);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch(':productId/edit')
  async updateCart(
    @Body() cartData: UpdateCartDto,
    @Param('productId', ParseIntPipe) productId: number,
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    try {
      const { quantity } = cartData;
      const cachedCart = await this.redisCacheService.getValue('cart');
      const cart = request.cookies.cart || JSON.parse(cachedCart ? cachedCart : null) || [];
      const updatedCart = await this.cartsService.updateCart(cart, productId, quantity);
      await this.redisCacheService.setValue('cart', JSON.stringify(updatedCart));
      response.cookie('cart', updatedCart, { httpOnly: true, secure: true });
      response.status(200).json(updatedCart);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Delete(':productId/delete')
  async deleteCart(
    @Param('productId', ParseIntPipe) productId: number,
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    try {
      const cachedCart = await this.redisCacheService.getValue('cart');
      const cart = request.cookies.cart || JSON.parse(cachedCart ? cachedCart : null) || [];
      const deletedCart = await this.cartsService.deleteCart(cart, productId);
      await this.redisCacheService.setValue('cart', JSON.stringify(deletedCart));
      response.cookie('cart', deletedCart, { httpOnly: true, secure: true });
      response.status(200).json(deletedCart);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }
}
