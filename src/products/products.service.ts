import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Product from './product.entity';
import { CreateProductDto } from './dto/createProduct.dto';
import UpdateProductDto from './dto/updateProduct.dto';
import User from '../users/user.entity';
import { FilterProductDto } from './dto/filterProduct.dto';
import ProductNotFoundException from './exceptions/productNotFound.exception';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private readonly productsRepository: Repository<Product>) {}

  async getFilteredProducts(filterProductData: FilterProductDto): Promise<Product[]> {
    const { search, categories, priceFrom, priceTo } = filterProductData;
    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    if (search) {
      queryBuilder.andWhere('product.name LIKE :search OR product.description LIKE :search', {
        search: `%${search}%`
      });
    }
    if (categories) {
      const categoryIds = [...categories];
      if (categoryIds.length > 0) {
        queryBuilder
          .leftJoin('product.categories', 'category')
          .andWhere('category.id IN (:...categoryIds)', { categoryIds });
      }
    }
    if (priceFrom && priceTo) {
      queryBuilder.andWhere('product.price BETWEEN :priceFrom AND :priceTo', { priceFrom, priceTo });
    } else if (priceFrom) {
      queryBuilder.andWhere('product.price >= :priceFrom', { priceFrom });
    } else if (priceTo) {
      queryBuilder.andWhere('product.price <= :priceTo', { priceTo });
    }
    const products = await queryBuilder.getMany();
    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['owner', 'categories'] });
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
    const updatedProduct = await this.productsRepository.findOne({ where: { id }, relations: ['owner', 'categories'] });
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
}
