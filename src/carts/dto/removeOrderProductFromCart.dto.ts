import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveOrderProductFromCart {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}

export default RemoveOrderProductFromCart;
