import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { IsUniqueEmailValidator } from '../validators/IsUniqueEmail.validator';
import { UsersController } from './users.controller';
import { RedisCacheModule } from '../redisCache/redisCache.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisCacheModule],
  controllers: [UsersController],
  providers: [UsersService, IsUniqueEmailValidator],
  exports: [UsersService]
})
export class UsersModule {}
