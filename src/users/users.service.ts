import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from './user.entity';
import { CreateUserDto } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import UserNotFoundException from './exceptions/userNotFound.exception';
import UpdateUserDto from './dto/updateUser.dto';
import ChangePassword from './dto/changePassword.dto';
import UpdateAddressDto from './dto/updateAddress.dto';
import Address from './address.entity';
import ChangeEmailDto from './dto/changeEmail.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>
  ) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['categories', 'products', 'address']
    });
    if (user) {
      return user;
    }
    throw new UserNotFoundException(id);
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, userData);
    const updatedUser = await this.usersRepository.findOne({
      where: { id },
      relations: ['categories', 'products', 'address']
    });
    if (updatedUser) {
      return updatedUser;
    }
    throw new UserNotFoundException(id);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.usersRepository.remove(user);
    await this.addressRepository.remove(user.address);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, {
      currentHashedRefreshToken
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number): Promise<User> {
    const user = await this.getUserById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number): Promise<any> {
    return await this.usersRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  async changePassword(userId: number, passwordData: ChangePassword): Promise<void> {
    const user = await this.getUserById(userId);
    const isPasswordMatching = await bcrypt.compare(passwordData.oldPassword, user.password);
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(passwordData.newPassword, 10);
    const updatedPassword = await this.usersRepository.update(userId, {
      password: hashedPassword
    });
    if (!updatedPassword.affected) {
      throw new UserNotFoundException(userId);
    }
  }

  async changeEmail(userId: number, emailData: ChangeEmailDto): Promise<void> {
    const user = await this.findUserByEmail(emailData.email);
    if (user) {
      throw new HttpException('This is email already exists', HttpStatus.BAD_REQUEST);
    }
    const updatedEmail = await this.usersRepository.update(userId, {
      email: emailData.email
    });
    if (!updatedEmail.affected) {
      throw new UserNotFoundException(userId);
    }
  }

  async updateAddress(id: number, addressData: UpdateAddressDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['categories', 'products', 'address']
    });
    user.address = addressData;
    await this.usersRepository.manager.save(user);
    if (user) {
      return user;
    }
    throw new UserNotFoundException(id);
  }

  async addAvatar(id: number, avatar: string): Promise<User> {
    await this.usersRepository.update(id, { avatar });
    const updatedUser = await this.usersRepository.findOne({
      where: { id },
      relations: ['categories', 'products', 'address']
    });
    if (!updatedUser) {
      throw new UserNotFoundException(id);
    }
    return updatedUser;
  }
}
