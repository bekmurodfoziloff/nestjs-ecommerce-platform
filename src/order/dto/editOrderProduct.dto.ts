import { IsNotEmpty, IsNumber } from 'class-validator';

export class EditOrderProductDto {
  @IsNumber()
  @IsNotEmpty()
  orderProductId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export default EditOrderProductDto;
