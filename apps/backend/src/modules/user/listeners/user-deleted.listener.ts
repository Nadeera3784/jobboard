import { Injectable } from '@nestjs/common';
import { EventListener } from '../..//core/event-dispatcher';

import { UserDeletedEvent } from '../events';
import { USER_DELETED } from '../constants';

@Injectable()
export class UserDeletedListener {
  @EventListener({
    eventName: USER_DELETED,
    priority: 90,
  })
  async onUserDeletedEvent(event: UserDeletedEvent) {
    console.log('onUserDeletedEvent', event);
  }
}
