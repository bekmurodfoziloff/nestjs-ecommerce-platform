import {
  Body,
  Req,
  Res,
  Controller,
  HttpCode,
  Post,
  Get,
  HttpStatus,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
import { LocalAuthnticationGuard } from './guards/localAuthentication.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { RedisCacheService } from '../redisCache/redisCache.service';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
    private readonly redisCacheService: RedisCacheService
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto, @Res() response: Response) {
    try {
      const user = await this.authenticationService.register(registrationData);
      await this.redisCacheService.setValue(`user:${user.id}`, JSON.stringify(user));
      response.status(HttpStatus.CREATED).json(user);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @HttpCode(200)
  @UseGuards(LocalAuthnticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const { user } = request;
      const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
      const { cookie: refreshTokenCookie, token: refreshToken } =
        this.authenticationService.getCookieWithJwtRefreshToken(user.id);
      await this.usersService.setCurrentRefreshToken(refreshToken, user.id);
      request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
      user.password = undefined;
      await this.redisCacheService.setValue(`user:${user.id}`, JSON.stringify(user));
      response.status(HttpStatus.OK).json(user);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      await this.usersService.removeRefreshToken(request.user.id);
      request.res.setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut());
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const { user } = request;
      await this.redisCacheService.setValue(`user:${user.id}`, JSON.stringify(user));
      response.status(HttpStatus.OK).json(user);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const { user } = request;
      const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
      request.res.setHeader('Set-Cookie', accessTokenCookie);
      await this.redisCacheService.setValue(`user:${user.id}`, JSON.stringify(user));
      response.status(HttpStatus.OK).json(user);
    } catch (error) {
      response.status(error.status).json(error.message);
    }
  }
}
