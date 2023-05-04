import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export default UpdateCartDto;
