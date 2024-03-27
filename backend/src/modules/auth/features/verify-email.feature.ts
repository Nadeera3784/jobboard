import { Injectable, HttpStatus } from '@nestjs/common';

import { VerificationTokenService } from '../services';
import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class VerifyEmailFeature extends BaseFeature {
  constructor(
    private readonly userService: UserService,
    private readonly verificationTokenService: VerificationTokenService,
  ) {
    super();
  }

  public async handle(token: string) {
    try {
      const existingToken =
        await this.verificationTokenService.getVerificationTokenByToken(token);

      if (!existingToken) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          'Token does not exist!',
        );
      }
      if (new Date(existingToken.expires) < new Date()) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          'Token has expired!',
        );
      }
      const existingUser = await this.userService.getByEmail(
        existingToken.email,
      );
      if (!existingUser) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          'Email does not exist!',
        );
      }
      await this.userService.updateEmailVerified(existingUser._id);
      await this.verificationTokenService.delete(existingToken._id);
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'Email verified!',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        ResponseType.ERROR,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
