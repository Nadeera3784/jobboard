import { Injectable, HttpStatus } from '@nestjs/common';

import { PasswordResetTokenService } from '../services';
import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../../user/services/user.service';
import { ResetPasswordDto } from '../dtos';

@Injectable()
export class ResetPasswordFeature extends BaseFeature {
  constructor(
    private readonly userService: UserService,
    private readonly passwordResetTokenService: PasswordResetTokenService,
  ) {
    super();
  }

  public async handle(token: string, resetPasswordDto: ResetPasswordDto) {
    try {
      if (!token) {
        return this.responseError(HttpStatus.BAD_REQUEST, 'Missing token!');
      }

      const existingToken = await this.passwordResetTokenService.getByToken(
        token,
      );

      if (!existingToken) {
        return this.responseError(HttpStatus.BAD_REQUEST, 'Invalid token!');
      }

      if (new Date(existingToken.expires) < new Date()) {
        return this.responseError(HttpStatus.BAD_REQUEST, 'Token has expired!');
      }

      const existingUser = await this.passwordResetTokenService.getByEmail(
        existingToken.email,
      );

      if (!existingUser) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          'Email does not exist!',
        );
      }

      await this.userService.updatePassword(
        existingUser._id,
        resetPasswordDto.password,
      );

      await this.passwordResetTokenService.delete(existingUser._id);

      return this.responseSuccess(HttpStatus.OK, 'Password updated!');
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
