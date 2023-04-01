import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './user.entity';
import { IsUniqueEmailValidator } from '../validators/IsUniqueEmail.validator';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UsersService, IsUniqueEmailValidator],
  exports: [UsersService]
})
export class UsersModule {}
