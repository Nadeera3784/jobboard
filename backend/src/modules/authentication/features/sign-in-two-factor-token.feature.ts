import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BaseFeature } from '../../app/features/base-feature';
import { AuthenticateTwoFactorTokenDto } from '../dtos';
import { TwoFactorAuthenticationTokenService } from '../services';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class SignInTwoFactorTokenFeature extends BaseFeature {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly twoFactorAuthenticationTokenService: TwoFactorAuthenticationTokenService,
  ) {
    super();
  }

  public async handle(
    userId: string,
    authenticateTwoFactorTokenDto: AuthenticateTwoFactorTokenDto,
  ) {
    try {
      const isCodeValid =
        await this.twoFactorAuthenticationTokenService.validateTwoFactorAuthenticationToken(
          userId,
          authenticateTwoFactorTokenDto.token,
        );

      if (isCodeValid) {
        const user = await this.userService.getById(userId);

        const payload = {
          id: userId,
        };

        const accessToken = this.jwtService.sign(payload);

        return this.responseSuccess(HttpStatus.OK, 'Login successfully', {
          type: 'Bearer',
          access_token: accessToken,
          redirect_identifier: user.role,
        });
      }

      return this.responseError(
        HttpStatus.UNAUTHORIZED,
        'Wrong authentication code',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
