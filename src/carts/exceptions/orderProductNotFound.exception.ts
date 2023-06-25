import { NotFoundException } from '@nestjs/common';

class OrderProductNotFoundException extends NotFoundException {
  constructor(productId: number) {
    super(`Order product with id ${productId} not found`);
  }
}

export default OrderProductNotFoundException;
