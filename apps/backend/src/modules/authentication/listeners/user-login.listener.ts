import { Injectable } from '@nestjs/common';
import { EventListener } from '../..//core/event-dispatcher';

import { USER_LOGIN_EVENT } from '../../authentication/constants';
import { UserLoginEvent } from '../../authentication/events/user-login-event';

@Injectable()
export class UserLoginListener {
  @EventListener({
    eventName: USER_LOGIN_EVENT,
    priority: 90,
  })
  async onUserLogInEvent(data: UserLoginEvent): Promise<void> {}
}
