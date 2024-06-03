import { UnauthorizedException } from '@nestjs/common';

export class RegisterEmailDomainException extends UnauthorizedException {
  public readonly message: string =
    'forms.error.validator.email-domain.unknown';
  public readonly reason: string = 'REASON_UNKNOWN_EMAIL_DOMAIN';
}
