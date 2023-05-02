import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import DiscountsService from '../discounts/discounts.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueDiscountNameValidator implements ValidatorConstraintInterface {
  constructor(private readonly discountsService: DiscountsService) {}
  async validate(name: string) {
    return await this.discountsService.getDiscountByName(name).then((name) => {
      if (name) return false;
      return true;
    });
  }

  defaultMessage(): string {
    return 'Discount $property with this $value already exists';
  }
}

export function IsUniqueDiscountName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueDiscountNameValidator
    });
  };
}
