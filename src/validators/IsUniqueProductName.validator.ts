import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { ProductsService } from '../products/products.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueProductNameValidator implements ValidatorConstraintInterface {
  constructor(private readonly productsService: ProductsService) {}
  async validate(name: string) {
    return await this.productsService.getProductByName(name).then((name) => {
      if (name) return false;
      return true;
    });
  }

  defaultMessage(): string {
    return 'Product $property with this $value already exists';
  }
}

export function IsUniqueProductName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueProductNameValidator
    });
  };
}
