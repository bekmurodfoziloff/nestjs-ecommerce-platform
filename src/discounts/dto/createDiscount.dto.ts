import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  discountPercent: number;

  @IsBoolean()
  active: boolean;
}

export default CreateDiscountDto;
