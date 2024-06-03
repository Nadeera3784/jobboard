import { UnauthorizedException } from '@nestjs/common';

export class CaptchaException extends UnauthorizedException {
  public readonly message: string =
    'For security reasons follow the prompts to prove you are a real person';
  public readonly reason: string = 'REASON_DISPLAY_CAPTCHA';
}
