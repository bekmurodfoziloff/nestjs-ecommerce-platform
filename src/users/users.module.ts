import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import User from './user.entity';
import { IsUniqueEmailValidator } from '../validators/IsUniqueEmail.validator';
import { UsersController } from './users.controller';
import Address from './address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Address]), ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, IsUniqueEmailValidator],
  exports: [UsersService]
})
export class UsersModule {}
