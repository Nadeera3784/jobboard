import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

import { UserService } from '../../user/services/user.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class EmailIsUnique implements ValidatorConstraintInterface {
  constructor(private readonly userService: UserService) {}
  public async validate(email: string): Promise<boolean> {
    return !(await this.userService.getByEmail(email));
  }

  public defaultMessage(_args: ValidationArguments): string {
    return `The email address is already in use. Please choose a different email.`;
  }
}

export function IsEmailUnique(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: EmailIsUnique,
    });
  };
}
