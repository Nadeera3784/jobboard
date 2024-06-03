import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../services/user.service';

@Injectable()
export class GetAllUsersFeature extends BaseFeature {
  constructor(private readonly userService: UserService) {
    super();
  }

  public async handle() {
    try {
      const data = await this.userService.getAll();
      return this.responseSuccess(HttpStatus.OK, null, data);
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
