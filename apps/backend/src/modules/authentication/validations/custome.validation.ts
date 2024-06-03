import { ValidationError } from 'class-validator';

export function getAllConstraints(errors: ValidationError[]): string[] {
  const constraints: string[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const constraintValues = Object.values(error.constraints);
      constraints.push(...constraintValues);
    }

    if (error.children) {
      const childConstraints = getAllConstraints(error.children);
      constraints.push(...childConstraints);
    }
  }

  return constraints;
}

export function getCustomValidationError(message: string | string[]) {
  return {
    statusCode: 422,
    message,
    error: 'Unprocessable Entity',
  };
}
