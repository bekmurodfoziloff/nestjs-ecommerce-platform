import {
  Controller,
  Get,
  Patch,
  Body,
  Delete,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { UsersService } from './users.service';
import UpdateUserDto from './dto/updateUser.dto';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import ChangePassword from './dto/changePassword.dto';
import RequestWithUser from '../authentication/interfaces/requestWithUser.interface';
import { Response } from 'express';
import UpdateAddressDto from './dto/updateAddress.dto';
import ChangeEmailDto from './dto/changeEmail.dto';
import LocalFilesInterceptor from '../utils/localFiles.interceptor';
import { RedisCacheService } from '../redisCache/redisCache.service';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly redisCacheService: RedisCacheService) {}

  @Get('profile')
  @UseGuards(JwtAuthenticationGuard)
  async getUserById(@Req() req: RequestWithUser, @Res() response: Response) {
    try {
      const { id } = req.user;
      const cachedUser = await this.redisCacheService.getValue(`user:${id}`);
      if (cachedUser) {
        response.status(HttpStatus.OK).json(JSON.parse(cachedUser));
      } else {
        const user = await this.usersService.getUserById(Number(id));
        await this.redisCacheService.setValue(`user:${id}`, JSON.stringify(user));
        response.status(HttpStatus.OK).json(user);
      }
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch('profile/edit')
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(@Req() req: RequestWithUser, @Body() userData: UpdateUserDto, @Res() response: Response) {
    try {
      const { id } = req.user;
      const updatedUser = await this.usersService.updateUser(Number(id), userData);
      await this.redisCacheService.setValue(`user:${id}`, JSON.stringify(updatedUser));
      response.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Delete('settings/account/delete')
  @UseGuards(JwtAuthenticationGuard)
  async deleteUser(@Req() req: RequestWithUser, @Res() response: Response) {
    try {
      const { id } = req.user;
      const deletedResponse = await this.usersService.deleteUser(Number(id));
      await this.redisCacheService.deleteValue(`user:${id}`);
      response.status(HttpStatus.OK).json(deletedResponse);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch('settings/password/edit')
  @UseGuards(JwtAuthenticationGuard)
  async changePassword(@Req() req: RequestWithUser, @Body() passwordData: ChangePassword, @Res() response: Response) {
    try {
      const changePasswordResponse = await this.usersService.changePassword(Number(req.user.id), passwordData);
      response.status(HttpStatus.OK).json(changePasswordResponse);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch('settings/email/edit')
  @UseGuards(JwtAuthenticationGuard)
  async changeEmail(@Req() req: RequestWithUser, @Body() emailData: ChangeEmailDto, @Res() response: Response) {
    try {
      const changeEmailResponse = await this.usersService.changeEmail(Number(req.user.id), emailData);
      response.status(HttpStatus.OK).json(changeEmailResponse);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch('address/edit')
  @UseGuards(JwtAuthenticationGuard)
  async updateAddress(@Req() req: RequestWithUser, @Body() addressData: UpdateAddressDto, @Res() response: Response) {
    try {
      const { id } = req.user;
      const updatedAddress = await this.usersService.updateAddress(Number(id), addressData);
      await this.redisCacheService.setValue(`user:${id}`, JSON.stringify(updatedAddress));
      response.status(HttpStatus.OK).json(updatedAddress);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @Patch('profile/avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'avatar',
      path: '/avatar',
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
  async addAvatar(@Req() req: RequestWithUser, @Res() response: Response, @UploadedFile() file: Express.Multer.File) {
    try {
      const { id } = req.user;
      const updatedUser = await this.usersService.addAvatar(Number(id), file.path);
      await this.redisCacheService.setValue(`user:${id}`, JSON.stringify(updatedUser));
      response.status(HttpStatus.OK).json(updatedUser);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }
}
