import { IsOptional, IsString } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  categories: string[];

  @IsOptional()
  @IsString()
  priceFrom: string;

  @IsOptional()
  @IsString()
  priceTo: string;
}

export default FilterProductDto;
