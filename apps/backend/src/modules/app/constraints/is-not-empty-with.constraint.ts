import {
  ValidationOptions,
  buildMessage,
  isNotEmpty,
  registerDecorator,
} from 'class-validator';

export function IsNotEmptyWith(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsNotEmptyWith',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value, args) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          if (isNotEmpty(relatedValue)) {
            return isNotEmpty(value);
          }
          return true;
        },
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}$property should not empty with $constraint1`,
          validationOptions,
        ),
      },
    });
  };
}
