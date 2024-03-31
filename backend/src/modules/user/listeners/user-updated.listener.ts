import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { UserUpdatedEvent } from '../events';
import { Events } from '../enums/events.enum';
import { UserService } from '../services/user.service';

@Injectable()
export class UserUpdatedListener {
  
  constructor(private readonly userService: UserService) {}

  @OnEvent(Events.USER_UPDATED)
  async handleUserUpdateddEvent(event: UserUpdatedEvent) {
     if(event.type === Events.USER_DATE_SYNC){
      await this.userService.refreshUpdatedDate(event.id);
     }
  }
}
