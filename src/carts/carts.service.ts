import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { Cart } from './cart.interface';
import User from '../users/entities/user.entity';
import AddOrderProductToCart from './dto/addOrderProductToCart.dto';
import RemoveOrderProductFromCart from './dto/removeOrderProductFromCart.dto';
import EditOrderProductDto from './dto/editOrderProduct.dto';
import CartNotFoundException from './exceptions/cartNotFound.exception';
import OrderProductNotFoundException from './exceptions/orderProductNotFound.exception';
import ProductNotFoundException from '../products/exceptions/productNotFound.exception';

@Injectable()
export class CartsService {
  constructor(private readonly productsService: ProductsService) {}

  private async createCart(
    customer: User,
    subTotalPrice: number,
    cartData: AddOrderProductToCart,
    totalPrice: number
  ): Promise<any> {
    const { productId, quantity } = cartData;
    const product = await this.productsService.getProductById(productId);
    const newCart = new Object({
      customer,
      orderProducts: [{ product, quantity, subTotalPrice }],
      totalPrice
    });
    return newCart;
  }

  private recalculateCart(cart: Cart) {
    cart.totalPrice = 0;
    cart.orderProducts.forEach((orderProduct) => {
      cart.totalPrice += orderProduct.quantity * orderProduct.product.price;
    });
  }

  async addOrderProductToCart(cart: Cart, customer: User, cartData: AddOrderProductToCart): Promise<Cart> {
    const { productId, quantity } = cartData;
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new ProductNotFoundException(productId);
    }
    const subTotalPrice = quantity * product.price;
    if (cart) {
      const orderProductIndex = cart.orderProducts.findIndex(
        (orderProduct) => Number(orderProduct.product.id) === Number(productId)
      );
      if (orderProductIndex > -1) {
        const orderProduct = cart.orderProducts[orderProductIndex];
        orderProduct.quantity = Number(orderProduct.quantity) + Number(quantity);
        orderProduct.subTotalPrice = orderProduct.quantity * orderProduct.product.price;
        cart.orderProducts[orderProductIndex] = orderProduct;
        this.recalculateCart(cart);
        return cart;
      } else {
        cart.orderProducts.push({ product, quantity, subTotalPrice });
        this.recalculateCart(cart);
        return cart;
      }
    } else {
      const newCart = await this.createCart(customer, subTotalPrice, cartData, subTotalPrice);
      return newCart;
    }
  }

  async editOrderProduct(cart: Cart, cartData: EditOrderProductDto): Promise<Cart> {
    const { productId, quantity } = cartData;
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new ProductNotFoundException(productId);
    }
    if (cart) {
      const orderProductIndex = cart.orderProducts.findIndex(
        (orderProduct) => Number(orderProduct.product.id) === Number(productId)
      );
      if (orderProductIndex > -1) {
        const orderProduct = cart.orderProducts[orderProductIndex];
        orderProduct.quantity = Number(quantity);
        orderProduct.subTotalPrice = orderProduct.quantity * orderProduct.product.price;
        cart.orderProducts[orderProductIndex] = orderProduct;
        this.recalculateCart(cart);
        return cart;
      }
      throw new OrderProductNotFoundException(productId);
    }
    throw new CartNotFoundException();
  }

  async removeOrderProductFromCart(cart: Cart, cartData: RemoveOrderProductFromCart): Promise<any> {
    const { productId } = cartData;
    const product = await this.productsService.getProductById(productId);
    if (!product) {
      throw new ProductNotFoundException(productId);
    }
    if (cart) {
      const orderProductIndex = cart.orderProducts.findIndex(
        (orderProduct) => Number(orderProduct.product.id) === Number(cartData.productId)
      );
      if (orderProductIndex > -1) {
        cart.orderProducts.splice(orderProductIndex, 1);
        this.recalculateCart(cart);
        return cart;
      }
      throw new OrderProductNotFoundException(cartData.productId);
    }
    throw new CartNotFoundException();
  }
}
