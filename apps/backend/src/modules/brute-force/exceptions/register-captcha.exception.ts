import { UnauthorizedException } from '@nestjs/common';

export class RegisterCaptchaException extends UnauthorizedException {
  public readonly message: string = 'Too many requests';
  public readonly reason: string = 'REASON_DISPLAY_CAPTCHA';
}
