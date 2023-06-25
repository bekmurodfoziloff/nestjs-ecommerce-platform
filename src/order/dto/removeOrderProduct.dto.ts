import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveOrderProductDto {
  @IsNumber()
  @IsNotEmpty()
  orderProductId: number;
}

export default RemoveOrderProductDto;
