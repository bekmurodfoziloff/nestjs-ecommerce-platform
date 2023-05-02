import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDiscountDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  discountPercent: number;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  active: boolean;
}

export default UpdateDiscountDto;
