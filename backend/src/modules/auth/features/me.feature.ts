import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class MeFeature extends BaseFeature {
  constructor(
    private readonly userService: UserService,
  ) {
    super();
  }

  public async handle(id: string) {
    try {
      const user = await this.userService.getById(id);
      return this.responseSuccess(
        HttpStatus.OK,
        null,
        user
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
