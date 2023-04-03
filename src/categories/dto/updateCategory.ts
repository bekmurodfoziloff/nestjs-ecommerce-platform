import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IsUniqueCategoryName } from '../../validators/IsUniqueCategoryName.validator';

export class UpdateCategoryDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsUniqueCategoryName()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
}

export default UpdateCategoryDto;
