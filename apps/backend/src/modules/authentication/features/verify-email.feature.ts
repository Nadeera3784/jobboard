import { Injectable, HttpStatus } from '@nestjs/common';

import { VerificationTokenService } from '../services';
import { Feature } from '../../app/features/feature';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class VerifyEmailFeature extends Feature {
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
          'Token does not exist!',
        );
      }
      if (new Date(existingToken.expires) < new Date()) {
        return this.responseError(HttpStatus.BAD_REQUEST, 'Token has expired!');
      }
      const existingUser = await this.userService.getByEmail(
        existingToken.email,
      );
      if (!existingUser) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          'Email does not exist!',
        );
      }
      await this.userService.updateEmailVerified(existingUser._id.toString());
      await this.verificationTokenService.delete(existingToken._id.toString());
      return this.responseSuccess(HttpStatus.OK, 'Email verified!');
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
