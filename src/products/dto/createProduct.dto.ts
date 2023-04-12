import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { IsUniqueProductName } from '../../validators/IsUniqueProductName.validator';

export class CreateProductDto {
  @IsUniqueProductName()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  SKU: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export default CreateProductDto;
