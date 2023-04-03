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
    const { search } = filterProductData;
    let products = await this.getAllProducts();
    if (search) {
      products = products.filter((product) => product.name.includes(search) || product.description.includes(search));
    }
    return products;
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productsRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!product) {
      throw new ProductNotFoundException(id);
    }
    return product;
  }

  async createProduct(productData: CreateProductDto, owner: User): Promise<Product> {
    const newProduct = this.productsRepository.create({
      ...productData,
      owner
    });
    await this.productsRepository.save(newProduct);
    return newProduct;
  }

  async updateProduct(id: number, productData: UpdateProductDto): Promise<Product> {
    await this.productsRepository.update(id, productData);
    const updatedProduct = await this.productsRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!updatedProduct) {
      throw new ProductNotFoundException(id);
    }
    return updatedProduct;
  }

  async deleteProduct(id: number) {
    const deletedProduct = await this.productsRepository.delete(id);
    if (!deletedProduct.affected) {
      throw new ProductNotFoundException(id);
    }
  }

  async getProductByName(name: string): Promise<Product> {
    return await this.productsRepository.findOne({ where: { name } });
  }
}
