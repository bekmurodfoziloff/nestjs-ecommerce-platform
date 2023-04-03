import { NotFoundException } from '@nestjs/common';

class ProductNotFoundException extends NotFoundException {
  constructor(productId: number) {
    super(`Product with id ${productId} not found`);
  }
}

export default ProductNotFoundException;
