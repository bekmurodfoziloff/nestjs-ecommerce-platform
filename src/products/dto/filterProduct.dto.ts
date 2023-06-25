import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  categories: number[];

  @IsOptional()
  @IsString()
  priceFrom: string;

  @IsOptional()
  @IsString()
  priceTo: string;

  @IsOptional()
  @IsNumber()
  page: number;
}

export default FilterProductDto;
