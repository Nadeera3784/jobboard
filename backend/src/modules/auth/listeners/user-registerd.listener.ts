import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserRegisterdEvent } from '../events/user-registerd.event';
import { AuthService } from '../services/auth.service';

@Injectable()
export class UserRegisterdListener {
  constructor(private readonly authService: AuthService) {}

  @OnEvent('user.registerd')
  async handleUserRegisterdEvent(event: UserRegisterdEvent) {
    await this.authService.sendVerificationMail(event);
  }
}
