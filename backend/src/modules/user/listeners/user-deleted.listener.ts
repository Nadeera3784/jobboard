import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserDeletedEvent } from '../events';
import { USER_DELETED } from '../constants';

@Injectable()
export class UserDeletedListener {
  constructor() {}

  @OnEvent(USER_DELETED)
  async handleUserDeletedEvent(event: UserDeletedEvent) {}
}
