import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserUpdatedEvent } from '../events';
import { USER_DATE_SYNC, USER_UPDATED } from '../constants';
import { UserService } from '../services/user.service';

@Injectable()
export class UserUpdatedListener {
  constructor(private readonly userService: UserService) {}

  @OnEvent(USER_UPDATED)
  async onUserUpdateddEvent(event: UserUpdatedEvent) {
    if (event.type === USER_DATE_SYNC) {
      await this.userService.refreshUpdatedDate(event.id);
    }
  }
}
