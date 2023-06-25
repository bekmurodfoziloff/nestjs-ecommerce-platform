import { NotFoundException } from '@nestjs/common';

class CartNotFoundException extends NotFoundException {
  constructor() {
    super(`Cart not found`);
  }
}

export default CartNotFoundException;
