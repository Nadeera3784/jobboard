import { Injectable, HttpStatus } from '@nestjs/common';

import { PasswordResetTokenService } from '../services';
import { Response as ResponseType } from '../../app/enums/response.enum';
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
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          '"Missing token!',
        );
      }

      const existingToken = await this.passwordResetTokenService.getByToken(
        token,
      );

      if (!existingToken) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          'Invalid token!',
        );
      }

      if (new Date(existingToken.expires) < new Date()) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          'Token has expired!',
        );
      }

      const existingUser = await this.passwordResetTokenService.getByEmail(
        existingToken.email,
      );

      if (!existingUser) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          'Email does not exist!',
        );
      }

      await this.userService.updatePassword(
        existingUser._id,
        resetPasswordDto.password,
      );

      await this.passwordResetTokenService.delete(existingUser._id);

      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'Password updated!',
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
