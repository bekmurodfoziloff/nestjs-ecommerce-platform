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
import DiscountsService from './discounts.service';
import CreateDiscountDto from './dto/createDiscount.dto';
import UpdateDiscountDto from './dto/updateDiscount.dto';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import FindOneParams from '../utils/findOneParams';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorators/roles.decorator';
import { Role } from '../utils/enums/role.enum';
import { PermissionsGuard } from '../authentication/guards/permissions.guard';
import { Permissions } from '../authentication/decorators/permissions.decorator';
import Permission from '../utils/permission.type';

@Controller('discount')
@UseInterceptors(ClassSerializerInterceptor)
export default class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Get()
  async getAllDiscounts(@Res() response: Response) {
    try {
      const discounts = await this.discountsService.getAllDiscounts();
      response.status(HttpStatus.OK).json(discounts);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Get(':id')
  async getDiscountById(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const discount = await this.discountsService.getDiscountById(Number(id));
      response.status(HttpStatus.OK).json(discount);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Post('new')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.CreateDiscount)
  async createDiscount(
    @Body() discountData: CreateDiscountDto,
    @Req() request: RequestWithUser,
    @Res() response: Response
  ) {
    try {
      const newDiscount = await this.discountsService.createDiscount(discountData, request.user);
      response.status(HttpStatus.CREATED).json(newDiscount);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch(':id/edit')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.UpdateDiscount)
  async updateDiscount(@Param() { id }: FindOneParams, @Body() discount: UpdateDiscountDto, @Res() response: Response) {
    try {
      const updateDiscount = await this.discountsService.updateDiscount(Number(id), discount);
      response.status(HttpStatus.OK).json(updateDiscount);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthenticationGuard, RolesGuard, PermissionsGuard)
  @Roles(Role.Admin)
  @Permissions(Permission.DeleteDiscount)
  async deleteDiscount(@Param() { id }: FindOneParams, @Res() response: Response) {
    try {
      const deletedResponse = await this.discountsService.deleteDiscount(Number(id));
      response.status(HttpStatus.OK).json(deletedResponse);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }
}