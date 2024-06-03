import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { pwnedPassword } from 'hibp';

@ValidatorConstraint({ async: true })
class PasswordNotPwned implements ValidatorConstraintInterface {
  public async validate(password: string): Promise<boolean> {
    return !(await pwnedPassword(password));
  }

  public defaultMessage(_args: ValidationArguments): string {
    return `The password has been found in a list of compromised passwords. Please choose a stronger password.`;
  }
}

export function IsPasswordNotPwned(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: PasswordNotPwned,
    });
  };
}
