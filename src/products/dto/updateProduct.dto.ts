import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { IsUniqueProductName } from '../../validators/IsUniqueProductName.validator';

export class UpdateProductDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsUniqueProductName()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  SKU: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export default UpdateProductDto;
