// tslint:disable: max-classes-per-file
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import * as PasswordValidator from 'password-validator';

const passwordSchema: any = new PasswordValidator();
passwordSchema
  .is()
  .min(6)
  .is()
  .max(32)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .symbols()
  .has()
  .digits()
  .has()
  .not()
  .spaces();

@ValidatorConstraint({ async: false })
class PasswordIsStrong implements ValidatorConstraintInterface {
  public validate(password: string, _args: ValidationArguments): boolean {
    return passwordSchema.validate(password);
  }
  public defaultMessage(_args: ValidationArguments): string {
    return `The password is too weak. Please choose a stronger one.`;
  }
}

export function IsPasswordStrong(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: PasswordIsStrong,
    });
  };
}
