import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { USER_LOGIN_EVENT } from '../../authentication/constants';
import { UserLoginEvent } from '../../authentication/events/user-login-event';

@Injectable()
export class UserLoginListener {
  @OnEvent(USER_LOGIN_EVENT)
  async onUserLogInEvent(data: UserLoginEvent): Promise<void> {}
}
