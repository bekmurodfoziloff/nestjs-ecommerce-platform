import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Order from './entities/order.entity';
import OrderProduct from './entities/orderProduct.entity';
import OrderNotFoundException from './exceptions/orderNotFound.exception';
import { EditOrderProductDto } from './dto/editOrderProduct.dto';
import { RemoveOrderProductDto } from './dto/removeOrderProduct.dto';
import OrderProductNotFoundException from '../carts/exceptions/orderProductNotFound.exception';
import CartNotFoundException from '../carts/exceptions/cartNotFound.exception';
import { ProductsService } from '../products/products.service';
import Product from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderProduct) private orderProductsRepository: Repository<OrderProduct>,
    @InjectRepository(Order) private productsRepository: Repository<Product>,
    private readonly configService: ConfigService,
    private readonly productsService: ProductsService
  ) {}

  async getAllOrders(userId: number, page: number): Promise<Order[]> {
    let pageNumber = 1;
    const pageSize = this.configService.get('PAGE_SIZE');
    if (page) {
      pageNumber = page;
    }
    return await this.ordersRepository.find({
      where: { customer: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['customer', 'orderProducts.product'],
      skip: pageNumber * pageSize - pageSize,
      take: pageSize
    });
  }

  async getOrderById(id: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id, customer: { id: userId } },
      relations: ['customer', 'orderProducts.product']
    });
    if (order) {
      return order;
    }
    throw new OrderNotFoundException(id);
  }

  async createOrder(orderData: Order): Promise<Order> {
    if (orderData) {
      const newOrder = this.ordersRepository.create(orderData);
      newOrder.orderProducts.forEach(async (orderProduct) => {
        const product = await this.productsService.getProductById(orderProduct.product.id);
        if (product.inventory.quantity > orderProduct.quantity) {
          product.inventory.quantity -= orderProduct.quantity;
          await this.productsRepository.manager.save(product);
        } else {
          orderProduct.quantity = product.inventory.quantity;
          orderProduct.subTotalPrice = orderProduct.quantity * orderProduct.product.price;
          await this.orderProductsRepository.manager.save(orderProduct);
          product.inventory.quantity -= product.inventory.quantity;
          await this.productsRepository.manager.save(product);
        }
      });
      await this.ordersRepository.save(newOrder);
      this.recalculateCart(newOrder);
      await this.ordersRepository.save(newOrder);
      return newOrder;
    }
    throw new CartNotFoundException();
  }

  private recalculateCart(order: Order) {
    order.totalPrice = 0;
    order.orderProducts.forEach((orderProduct) => {
      order.totalPrice += orderProduct.quantity * orderProduct.product.price;
    });
  }

  async editOrderProduct(id: number, orderData: EditOrderProductDto): Promise<Order> {
    const { orderProductId, quantity } = orderData;
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'orderProducts.product']
    });
    if (order) {
      const orderProduct = order.orderProducts.find(
        (orderProduct) => Number(orderProduct.id) === Number(orderProductId)
      );
      if (orderProduct) {
        const product = await this.productsService.getProductById(orderProduct.product.id);
        if (Number(product.inventory.quantity) + Number(orderProduct.quantity) > Number(quantity)) {
          product.inventory.quantity += Number(orderProduct.quantity) - Number(quantity);
          await this.productsRepository.manager.save(product);
        } else {
          orderProduct.quantity = product.inventory.quantity;
          orderProduct.subTotalPrice = orderProduct.quantity * orderProduct.product.price;
          await this.orderProductsRepository.manager.save(orderProduct);
          product.inventory.quantity -= product.inventory.quantity;
          await this.productsRepository.manager.save(product);
        }

        orderProduct.quantity = Number(quantity);
        orderProduct.subTotalPrice = orderProduct.quantity * orderProduct.product.price;
        this.recalculateCart(order);
        await this.orderProductsRepository.manager.save(orderProduct);
        return await this.ordersRepository.manager.save(order);
      }
      throw new OrderProductNotFoundException(orderProductId);
    }
    throw new OrderNotFoundException(id);
  }

  async removeOrderProduct(id: number, orderData: RemoveOrderProductDto): Promise<Order> {
    const { orderProductId } = orderData;
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'orderProducts.product']
    });
    if (order) {
      const orderProductIndex = order.orderProducts.findIndex(
        (orderProduct) => Number(orderProduct.id) === Number(orderProductId)
      );
      if (orderProductIndex > -1) {
        const product = await this.productsService.getProductById(order.orderProducts[orderProductIndex].product.id);
        product.inventory.quantity =
          Number(product.inventory.quantity) + Number(order.orderProducts[orderProductIndex].quantity);
        await this.productsRepository.manager.save(product);

        order.orderProducts.splice(orderProductIndex, 1);
        this.recalculateCart(order);
        await this.orderProductsRepository.delete(orderProductId);
        await this.ordersRepository.manager.save(order);
        if (order.orderProducts.length === 0) {
          await this.deleteOrder(Number(id));
          return order;
        } else {
          return order;
        }
      }
      throw new OrderProductNotFoundException(orderProductId);
    }
    throw new OrderNotFoundException(id);
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer', 'orderProducts.product']
    });
    if (order) {
      order.orderProducts.forEach(async (orderProduct) => {
        const product = await this.productsService.getProductById(orderProduct.product.id);
        product.inventory.quantity = Number(product.inventory.quantity) + Number(orderProduct.quantity);
        await this.productsRepository.manager.save(product);
      });
    }

    const deleteResponse = await this.ordersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new OrderNotFoundException(id);
    }
  }
}
