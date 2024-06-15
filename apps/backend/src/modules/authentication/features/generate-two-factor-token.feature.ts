import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { TwoFactorAuthenticationTokenService } from '../services';

@Injectable()
export class GenerateTwoFactorTokenFeature extends Feature {
  constructor(
    private readonly twoFactorAuthenticationTokenService: TwoFactorAuthenticationTokenService,
  ) {
    super();
  }

  public async handle(userId: string) {
    try {
      const data =
        await this.twoFactorAuthenticationTokenService.generateTwoFactorAuthenticationToken(
          userId,
        );
      return this.responseSuccess(HttpStatus.OK, null, data);
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
