import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { Cart } from './cart.interface';

@Injectable()
export class CartsService {
  constructor(private readonly productsService: ProductsService) {}

  async getcart(cart: Cart[]): Promise<any> {
    const productIds = cart.map((item) => item.productId);
    const products = await this.productsService.findProductByIds(productIds);
    const cartItems = cart.map((item) => {
      const product = products.find((p) => Number(p.id) === Number(item.productId));
      return {
        product,
        quantity: item.quantity
      };
    });
    return cartItems;
  }

  async createCart(cart: Cart[], productId: number, quantity: number) {
    const existingItemIndex = cart.findIndex((item) => Number(item.productId) === Number(productId));
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity = Number(cart[existingItemIndex].quantity) + Number(quantity);
    } else {
      cart.push({ productId, quantity });
    }
    return cart;
  }

  async updateCart(cart: Cart[], productId: number, quantity: number) {
    const itemIndex = cart.findIndex((item) => Number(item.productId) === Number(productId));
    if (itemIndex !== -1) {
      cart[itemIndex].quantity = Number(quantity);
    }
    return cart;
  }

  async deleteCart(cart: Cart[], productId: number) {
    const itemIndex = cart.findIndex((item) => Number(item.productId) === Number(productId));
    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
    }
    return cart;
  }
}
