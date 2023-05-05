import { Injectable } from '@nestjs/common';
import CreateDiscountDto from './dto/createDiscount.dto';
import Discount from './discounts.entity';
import UpdateDiscountDto from './dto/updateDiscount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import DiscountNotFoundException from './exceptions/discountNotFound.exception';
import User from '../users/user.entity';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private discountsRepository: Repository<Discount>
  ) {}

  async getAllDiscounts(): Promise<Discount[]> {
    return await this.discountsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getDiscountById(id: number): Promise<Discount> {
    const discount = await this.discountsRepository.findOne({ where: { id }, relations: ['owner', 'products'] });
    if (discount) {
      return discount;
    }
    throw new DiscountNotFoundException(id);
  }

  async createDiscount(discount: CreateDiscountDto, owner: User): Promise<Discount> {
    const newDiscount = this.discountsRepository.create({
      ...discount,
      owner
    });
    await this.discountsRepository.save(newDiscount);
    return newDiscount;
  }

  async updateDiscount(id: number, discount: UpdateDiscountDto): Promise<Discount> {
    await this.discountsRepository.update(id, discount);
    const updatedDiscount = await this.discountsRepository.findOne({
      where: { id },
      relations: ['owner', 'products']
    });
    if (updatedDiscount) {
      return updatedDiscount;
    }
    throw new DiscountNotFoundException(id);
  }

  async deleteDiscount(id: number): Promise<void> {
    const deleteResponse = await this.discountsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new DiscountNotFoundException(id);
    }
  }

  async getDiscountByName(name: string): Promise<Discount> {
    return await this.discountsRepository.findOne({ where: { name } });
  }
}
