import { IsNotEmpty, IsNumber } from 'class-validator';

export class EditOrderProductDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export default EditOrderProductDto;
