import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserRegisterdEvent } from '../events/user-registerd.event';
import { AuthenticationService } from '../services/authentication.service';
import { USER_REGISTERED } from '../../user/constants';

@Injectable()
export class UserRegisterdListener {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @OnEvent(USER_REGISTERED)
  async handleUserRegisterdEvent(event: UserRegisterdEvent) {
    await this.authenticationService.sendVerificationMail(event);
  }
}
