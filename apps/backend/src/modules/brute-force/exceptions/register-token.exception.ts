import { UnauthorizedException } from '@nestjs/common';

export class RegisterInviteTokenException extends UnauthorizedException {
  public readonly message: string =
    'forms.error.validator.invite-token.invalid';
  public readonly reason: string = 'REASON_INVALID_INVITE_TOKEN';
}
