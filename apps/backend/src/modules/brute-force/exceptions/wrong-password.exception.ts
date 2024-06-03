import { UnauthorizedException } from '@nestjs/common';

export class WrongPasswordException extends UnauthorizedException {
  public readonly message: string = 'Wrong Email or Password';
  public readonly reason: string = 'REASON_WRONG_PASSWORD';
}
