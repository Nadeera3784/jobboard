import { Injectable, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../services/user.service';
import { UserDeletedEvent } from '../events/user-deleted.event';
import { Events } from '../enums/events.enum';

@Injectable()
export class DeleteUserFeature extends BaseFeature {
  constructor(
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  public async handle(id: string) {
    try {
      await this.userService.delete(id);
      await this.dispatchEvent(id);
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'User has been deleted successfully',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        ResponseType.ERROR,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }

  private  async dispatchEvent(id : string){
    const event = new UserDeletedEvent();
    event.id = id;
    this.eventEmitter.emit(Events.USER_DELETED, event);
  }
}
