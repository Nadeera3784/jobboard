import { Injectable } from '@nestjs/common';
import { EventListener } from '../..//core/event-dispatcher';

import { UserRegisterdEvent } from '../events/user-registerd.event';
import { AuthenticationService } from '../services/authentication.service';
import { USER_REGISTERED } from '../../user/constants';

@Injectable()
export class UserRegisterdListener {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @EventListener({
    eventName: USER_REGISTERED,
    priority: 90,
  })
  async onUserRegisterdEvent(event: UserRegisterdEvent) {
    await this.authenticationService.sendVerificationMail(event);
  }
}
