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
  async onUserLogInEvent(_data: UserLoginEvent): Promise<void> {
    // TODO: Implement user login event handling logic
    // This could include logging, analytics, or other post-login actions
  }
}
