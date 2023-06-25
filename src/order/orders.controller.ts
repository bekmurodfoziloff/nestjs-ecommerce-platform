import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query
} from '@nestjs/common';
import { Response } from 'express';
import { OrdersService } from './orders.service';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import FindOneParams from '../utils/findOneParams';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import { Roles } from '../authentication/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { RedisCacheService } from '../redisCache/redisCache.service';
import { PermissionsGuard } from '../authentication/guards/permissions.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Permissions } from '../authentication/decorators/permissions.decorator';
import Permission from '../utils/permission.type';
import { EditOrderProductDto } from './dto/editOrderProduct.dto';
import { RemoveOrderProductDto } from './dto/removeOrderProduct.dto';

@Controller('order')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly redisCacheService: RedisCacheService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.User)
  async getAllOrders(@Query('page') page: number, @Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const cachedOrders = await this.redisCacheService.getValue('orders');
      if (cachedOrders && !page) {
        response.status(HttpStatus.OK).json(cachedOrders);
      } else {
        const orders = await this.ordersService.getAllOrders(Number(request.user.id), page);
        await this.redisCacheService.setValue('orders', orders);
        response.status(HttpStatus.OK).json(orders);
      }
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.User)
  async getOrderById(@Param() { id }: FindOneParams, @Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const cachedOrder = await this.redisCacheService.getValue(`order:${id}`);
      if (cachedOrder) {
        response.status(HttpStatus.OK).json(cachedOrder);
      } else {
        const order = await this.ordersService.getOrderById(Number(id), Number(request.user.id));
        await this.redisCacheService.setValue(`order:${id}`, order);
        response.status(HttpStatus.OK).json(order);
      }
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Post('new')
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  @Roles(Role.User)
  async createOrder(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const cachedCart = await this.redisCacheService.getValue(`cartCustomerId:${request.user.id}`);
      const cart = request.cookies.cart || cachedCart;
      const newOrder = await this.ordersService.createOrder(cart);
      await this.redisCacheService.setValue(`order:${newOrder.id}`, newOrder);
      await this.redisCacheService.deleteValue(`cartCustomerId:${request.user.id}`);
      response.clearCookie('cart');
      response.status(HttpStatus.CREATED).json(newOrder);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Patch(':id/product/edit')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.EditOrderProduct)
  async editOrderProduct(
    @Param() { id }: FindOneParams,
    @Body() orderData: EditOrderProductDto,
    @Res() response: Response
  ) {
    try {
      const updatedOrderProduct = await this.ordersService.editOrderProduct(Number(id), orderData);
      await this.redisCacheService.setValue(`order:${id}`, updatedOrderProduct);
      response.status(HttpStatus.OK).json(updatedOrderProduct);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Delete(':id/product/remove')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.RemoveOrderProduct)
  async removeOrderProduct(
    @Param() { id }: FindOneParams,
    @Body() orderData: RemoveOrderProductDto,
    @Res() response: Response
  ) {
    try {
      const deletedOrderProduct = await this.ordersService.removeOrderProduct(Number(id), orderData);
      if (deletedOrderProduct) {
        await this.redisCacheService.setValue(`order:${id}`, deletedOrderProduct);
        response.status(HttpStatus.OK).json(deletedOrderProduct);
      } else {
        await this.redisCacheService.deleteValue(`order:${id}`);
        response.status(HttpStatus.OK).json(deletedOrderProduct);
      }
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.DeleteOrder)
  async deleteOrder(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const deletedResponse = await this.ordersService.deleteOrder(Number(id));
      await this.redisCacheService.deleteValue(`order:${id}`);
      response.status(HttpStatus.OK).json(deletedResponse);
    } catch (error) {
      response.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
    }
  }
}
