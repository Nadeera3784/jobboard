import { Injectable, HttpStatus } from '@nestjs/common';
import { EventDispatcher } from '../../core/event-dispatcher';

import { PasswordResetTokenService } from '../services';
import { UserService } from '../../user/services/user.service';
import { Feature } from '../../app/features/feature';
import { ForgotPasswordDto } from '../dtos';
import { ResetPasswordEvent } from '../events/reset-password.event';
import { RESET_PASSWORD } from '../constants';
import { User } from '../../user/schemas/user.schema';

@Injectable()
export class ForgotPasswordFeature extends Feature {
  constructor(
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly userService: UserService,
    private eventDispatcher: EventDispatcher,
  ) {
    super();
  }

  public async handle(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const existingUser = await this.userService.getByEmail(
        forgotPasswordDto.email,
      );

      if (!existingUser) {
        return this.responseError(HttpStatus.BAD_REQUEST, 'Email not found!');
      }
      await this.passwordResetTokenService.generatePasswordResetToken(
        forgotPasswordDto.email,
      );

      this.publishEvents(existingUser);

      return this.responseSuccess(HttpStatus.OK, 'Reset email sent!');
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }

  private async publishEvents(user: User) {
    const verificationToken =
      await this.passwordResetTokenService.generatePasswordResetToken(
        user.email,
      );
    const event: ResetPasswordEvent = {
      token: verificationToken.token,
      email: verificationToken.email,
    };
    this.eventDispatcher.dispatch(RESET_PASSWORD, event);
  }
}
