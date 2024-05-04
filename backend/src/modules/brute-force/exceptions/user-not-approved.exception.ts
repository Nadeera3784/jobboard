import { UnauthorizedException } from '@nestjs/common';

export class UserNotApprovedException extends UnauthorizedException {
  public readonly message: string =
    'User registration is not approved by business';
  public readonly reason: string = 'REASON_NOT_APPROVED';
}
