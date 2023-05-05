import { Injectable } from '@nestjs/common';
import CreateCategoryDto from './dto/createCategory.dto';
import Category from './category.entity';
import UpdateCategoryDto from './dto/updateCategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CategoryNotFoundException from './exceptions/categoryNotFound.exception';
import User from '../users/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return await this.categoriesRepository.find({ order: { createdAt: 'DESC' } });
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOne({ where: { id }, relations: ['owner', 'products'] });
    if (category) {
      return category;
    }
    throw new CategoryNotFoundException(id);
  }

  async createCategory(category: CreateCategoryDto, owner: User): Promise<Category> {
    const newCategory = this.categoriesRepository.create({
      ...category,
      owner
    });
    await this.categoriesRepository.save(newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: UpdateCategoryDto): Promise<Category> {
    await this.categoriesRepository.update(id, category);
    const updatedCategory = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['owner', 'products']
    });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new CategoryNotFoundException(id);
  }

  async deleteCategory(id: number): Promise<void> {
    const deleteResponse = await this.categoriesRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new CategoryNotFoundException(id);
    }
  }

  async getCategoryByName(name: string): Promise<Category> {
    return await this.categoriesRepository.findOne({ where: { name } });
  }
}
