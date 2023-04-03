import { IsString, IsNotEmpty } from 'class-validator';
import { IsUniqueCategoryName } from '../../validators/IsUniqueCategoryName.validator';

export class CreateCategoryDto {
  @IsUniqueCategoryName()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export default CreateCategoryDto;
