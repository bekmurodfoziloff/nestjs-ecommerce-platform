import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import CategoriesService from 'src/categories/categories.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueCategoryNameValidator implements ValidatorConstraintInterface {
  constructor(private readonly productsService: CategoriesService) {}
  async validate(name: string) {
    return await this.productsService.getCategoryByName(name).then((name) => {
      if (name) return false;
      return true;
    });
  }

  defaultMessage(): string {
    return 'Category $property with this $value already exists';
  }
}

export function IsUniqueCategoryName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueCategoryNameValidator
    });
  };
}
