import { Injectable, HttpStatus } from '@nestjs/common';

import { PasswordResetTokenService } from '../services/password-reset-token.service';
import { UserService } from '../../user/services/user.service';
import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';

@Injectable()
export class ForgotPasswordFeature extends BaseFeature {
  constructor(
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly userService: UserService,
  ) {
    super();
  }

  public async handle(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const existingUser = this.userService.getByEmail(forgotPasswordDto.email);
      if (!existingUser) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          'Email not found!',
        );
      }
      this.passwordResetTokenService.generatePasswordResetToken(
        forgotPasswordDto.email,
      );
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'Reset email sent!',
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
