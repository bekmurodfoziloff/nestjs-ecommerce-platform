import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import Product from './entities/product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import UpdateProductDto from './dto/updateProduct.dto';
import User from '../users/entities/user.entity';
import { FilterProductDto } from './dto/filterProduct.dto';
import ProductNotFoundException from './exceptions/productNotFound.exception';
import Inventory from './entities/inventory.entity';
import UpdateInvertoryDto from './dto/updateInvertory.dto';
import { ConfigService } from '@nestjs/config';
import UpdateCategoriesDto from './dto/updateCategories.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(Inventory) private readonly inventoriesRepository: Repository<Inventory>,
    private readonly configService: ConfigService
  ) {}

  async getFilteredProducts(filterProductData: FilterProductDto): Promise<Product[]> {
    const { search, categories, priceFrom, priceTo, page } = filterProductData;
    let pageNumber = 1;
    const pageSize = this.configService.get('PAGE_SIZE');
    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    if (search) {
      queryBuilder.andWhere('product.name LIKE :search OR product.description LIKE :search', {
        search: `%${search}%`
      });
    }
    if (categories) {
      if (Array.isArray(categories)) {
        queryBuilder
          .leftJoinAndSelect('product.categories', 'category')
          .andWhere('category.id IN (:...categories)', { categories });
      } else {
        const categoryId = [categories];
        queryBuilder
          .leftJoinAndSelect('product.categories', 'category')
          .andWhere('category.id IN (:...categoryId)', { categoryId });
      }
    }
    if (priceFrom && priceTo) {
      queryBuilder.andWhere('product.price BETWEEN :priceFrom AND :priceTo', { priceFrom, priceTo });
    } else if (priceFrom) {
      queryBuilder.andWhere('product.price >= :priceFrom', { priceFrom });
    } else if (priceTo) {
      queryBuilder.andWhere('product.price <= :priceTo', { priceTo });
    } else if (page) {
      pageNumber = page;
    }
    const products = await queryBuilder
      .orderBy('product.createdAt', 'DESC')
      .skip(pageNumber * pageSize - pageSize)
      .take(pageSize)
      .leftJoinAndSelect('product.owner', 'user')
      .leftJoinAndSelect('product.inventory', 'inventory')
      .leftJoinAndSelect('product.discount', 'discount')
      .getMany();
    return products;
  }

  async getAllProducts(page: number): Promise<Product[]> {
    let pageNumber = 1;
    const pageSize = this.configService.get('PAGE_SIZE');
    if (page) {
      pageNumber = page;
    }
    return await this.productsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['owner', 'categories', 'inventory', 'discount'],
      skip: pageNumber * pageSize - pageSize,
      take: pageSize
    });
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['owner', 'categories', 'inventory', 'discount']
    });
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return product;
  }

  async createProduct(productData: CreateProductDto, owner: User, imageURL: string): Promise<Product> {
    const newProduct = this.productsRepository.create({
      ...productData,
      owner,
      imageURL
    });
    await this.productsRepository.save(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, productData: UpdateProductDto, imageURL: string): Promise<Product> {
    await this.productsRepository.update(id, { ...productData, imageURL });
    const updatedProduct = await this.productsRepository.findOne({
      where: { id },
      relations: ['owner', 'categories', 'inventory', 'discount']
    });
    if (!updatedProduct) {
      throw new ProductNotFoundException(id);
    }
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    const deletedResponse = await this.productsRepository.delete(id);
    if (!deletedResponse.affected) {
      throw new ProductNotFoundException(id);
    }
  }

  async getProductByName(name: string): Promise<Product> {
    return await this.productsRepository.findOne({ where: { name } });
  }

  async updateInvertory(id: number, invertoryData: UpdateInvertoryDto): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['owner', 'categories', 'inventory', 'discount']
    });
    if (product) {
      if (product.inventory) {
        product.inventory = {
          id: product.inventory.id,
          quantity: invertoryData.quantity
            ? Number(product.inventory.quantity) + Number(invertoryData.quantity)
            : product.inventory.quantity
        };
        await this.productsRepository.manager.save(product);
        return product;
      } else {
        product.inventory = invertoryData;
        await this.productsRepository.manager.save(product);
        return product;
      }
    }
    throw new ProductNotFoundException(id);
  }

  async updateCategories(id: number, categoriesData: UpdateCategoriesDto): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['owner', 'categories', 'inventory', 'discount']
    });
    if (product) {
      product.categories = [];
      await this.productsRepository.manager.save(product);
      product.categories = categoriesData.categories;
      await this.productsRepository.manager.save(product);
      return product;
    }
    throw new ProductNotFoundException(id);
  }

  async findProductByIds(productIds: number[]) {
    return await this.productsRepository.findBy({ id: In(productIds) });
  }
}
