import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserDeletedEvent } from '../events';
import { Events } from '../enums/events.enum';

@Injectable()
export class UserDeletedListener {
  constructor() {}

  @OnEvent(Events.USER_DELETED)
  async handleUserDeletedEvent(event: UserDeletedEvent) {
    
  }
}
