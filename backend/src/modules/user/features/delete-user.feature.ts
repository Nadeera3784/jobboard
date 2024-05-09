import { Injectable, HttpStatus } from '@nestjs/common';
import { EventDispatcher } from '../../core/event-dispatcher';

import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../services/user.service';
import { UserDeletedEvent } from '../events/user-deleted.event';
import { USER_DELETED } from '../constants';

@Injectable()
export class DeleteUserFeature extends BaseFeature {
  constructor(
    private readonly userService: UserService,
    private eventDispatcher: EventDispatcher,
  ) {
    super();
  }

  public async handle(id: string) {
    try {
      await this.userService.delete(id);
      await this.dispatchEvent(id);
      return this.responseSuccess(
        HttpStatus.OK,
        'User has been deleted successfully',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }

  private async dispatchEvent(id: string) {
    const event: UserDeletedEvent = { id: id };
    this.eventDispatcher.dispatch(USER_DELETED, event);
  }
}
