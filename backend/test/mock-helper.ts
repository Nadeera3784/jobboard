import { ValidationError } from 'class-validator';

export function stringified(errors: ValidationError[]): string {
  return JSON.stringify(errors);
}
