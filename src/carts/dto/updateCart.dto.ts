import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  quantity: number;
}

export default UpdateCartDto;
