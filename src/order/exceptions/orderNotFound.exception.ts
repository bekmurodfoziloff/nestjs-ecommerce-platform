import { NotFoundException } from '@nestjs/common';

class OrderNotFoundException extends NotFoundException {
  constructor(orderId: number) {
    super(`Order with id ${orderId} not found`);
  }
}

export default OrderNotFoundException;
