import { Injectable } from '@nestjs/common';
import { EventListener } from '../..//core/event-dispatcher';

import { ResetPasswordEvent } from '../events/reset-password.event';
import { AuthenticationService } from '../services/authentication.service';
import { RESET_PASSWORD } from '../constants';

@Injectable()
export class ResetPasswordListener {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @EventListener({
    eventName: RESET_PASSWORD,
    priority: 90,
  })
  async onUserRegisterdEvent(event: ResetPasswordEvent) {
    await this.authenticationService.sendResetPasswordMail(event);
  }
}
