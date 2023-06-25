import { IsNotEmpty, IsOptional } from 'class-validator';
import Category from '../../categories/category.entity';

class UpdateCategoriesDto {
  @IsOptional()
  @IsNotEmpty()
  public categories: Category[];
}

export default UpdateCategoriesDto;
