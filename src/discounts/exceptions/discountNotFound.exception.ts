import { NotFoundException } from '@nestjs/common';

class DiscountNotFoundException extends NotFoundException {
  constructor(discountId: number) {
    super(`Discount with id ${discountId} not found`);
  }
}

export default DiscountNotFoundException;
