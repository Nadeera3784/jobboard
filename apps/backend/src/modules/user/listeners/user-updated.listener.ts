import { Injectable } from '@nestjs/common';
import { EventListener } from '../..//core/event-dispatcher';

import { UserUpdatedEvent } from '../events';
import { USER_DATE_SYNC, USER_UPDATED } from '../constants';
import { UserService } from '../services/user.service';

@Injectable()
export class UserUpdatedListener {
  constructor(private readonly userService: UserService) {}

  @EventListener({
    eventName: USER_UPDATED,
    priority: 90,
  })
  async onUserUpdateddEvent(event: UserUpdatedEvent) {
    if (event.type === USER_DATE_SYNC) {
      await this.userService.refreshUpdatedDate(event.id);
    }
  }
}
