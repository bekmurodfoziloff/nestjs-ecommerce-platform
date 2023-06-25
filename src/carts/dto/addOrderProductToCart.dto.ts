import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddOrderProductToCart {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export default AddOrderProductToCart;
