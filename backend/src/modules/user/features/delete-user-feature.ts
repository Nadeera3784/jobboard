import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { UserService } from '../services/user.service';

@Injectable()
export class DeleteUserFeature extends BaseFeature {

  constructor(
    private readonly userService: UserService,
  ) {
    super();
  }

  public async handle(id: string) {
    try {
      await this.userService.delete(id);
      return this.responseSuccess(HttpStatus.OK, ResponseType.SUCCESS, 'User has been deleted successfully')
    } catch (error) {
      return this.responseError(HttpStatus.BAD_REQUEST, ResponseType.ERROR, 'Something went wrong, Please try again later', error);
    }
  }

}