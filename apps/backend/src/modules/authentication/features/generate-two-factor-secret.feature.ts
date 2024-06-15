import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { UserService } from '../../user/services/user.service';
import { TwoFactorAuthenticationTokenService } from '../services';

@Injectable()
export class GenerateTwoFactorSecretFeature extends Feature {
  constructor(
    private readonly userService: UserService,
    private readonly twoFactorAuthenticationTokenService: TwoFactorAuthenticationTokenService,
  ) {
    super();
  }

  public async handle(userId: string) {
    try {
      const user = await this.userService.getById(userId);
      const data =
        await this.twoFactorAuthenticationTokenService.generateTwoFactorAuthenticationSecret(
          user,
        );
      const payload =
        await this.twoFactorAuthenticationTokenService.generateQrCodeDataURL(
          data.otpAuthUrl,
        );
      return this.responseSuccess(HttpStatus.OK, null, payload);
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
