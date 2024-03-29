import { Injectable, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { PasswordResetTokenService } from '../services';
import { UserService } from '../../user/services/user.service';
import { BaseFeature } from '../../app/features/base-feature';
import { ForgotPasswordDto } from '../dtos';
import { ResetPasswordEvent } from '../events/reset-password.event';
import { Events } from '../enums/events.enum';

@Injectable()
export class ForgotPasswordFeature extends BaseFeature {
  constructor(
    private readonly passwordResetTokenService: PasswordResetTokenService,
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  public async handle(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const existingUser = await this.userService.getByEmail(
        forgotPasswordDto.email,
      );

      if (!existingUser) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          'Email not found!',
        );
      }
      await this.passwordResetTokenService.generatePasswordResetToken(
        forgotPasswordDto.email,
      );

      this.publishEvents(existingUser);

      return this.responseSuccess(
        HttpStatus.OK,
        'Reset email sent!',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }

  private async publishEvents(user) {
    const resetPasswordEvent = new ResetPasswordEvent();
    const verificationToken =
      await this.passwordResetTokenService.generatePasswordResetToken(
        user.email,
      );
    resetPasswordEvent.token = verificationToken.token;
    resetPasswordEvent.email = verificationToken.email;
    this.eventEmitter.emit(Events.RESET_PASSWORD, resetPasswordEvent);
  }
}
