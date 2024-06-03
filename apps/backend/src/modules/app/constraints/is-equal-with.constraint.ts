import {
  ValidationOptions,
  buildMessage,
  equals,
  registerDecorator,
} from 'class-validator';

export function IsEqualWith(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'IsEqualWith',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value, args) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];

          return equals(value, relatedValue);
        },
        defaultMessage: buildMessage(
          (eachPrefix) =>
            `${eachPrefix}$property should equal with $constraint1`,
          validationOptions,
        ),
      },
    });
  };
}
