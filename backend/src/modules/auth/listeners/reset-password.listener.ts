import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ResetPasswordEvent } from '../events/reset-password.event';
import { AuthService } from '../services/auth.service';
import { Events } from '../enums/events.enum';

@Injectable()
export class ResetPasswordListener {
  constructor(private readonly authService: AuthService) {}

  @OnEvent(Events.RESET_PASSWORD)
  async handleUserRegisterdEvent(event: ResetPasswordEvent) {
    await this.authService.sendResetPasswordMail(event);
  }
}
