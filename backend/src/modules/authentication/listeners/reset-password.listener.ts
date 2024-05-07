import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ResetPasswordEvent } from '../events/reset-password.event';
import { AuthenticationService } from '../services/authentication.service';
import { RESET_PASSWORD } from '../constants';

@Injectable()
export class ResetPasswordListener {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @OnEvent(RESET_PASSWORD)
  async onUserRegisterdEvent(event: ResetPasswordEvent) {
    await this.authenticationService.sendResetPasswordMail(event);
  }
}
