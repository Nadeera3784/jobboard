import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class MeFeature extends Feature {
  constructor(private readonly userService: UserService) {
    super();
  }

  public async handle(id: string) {
    try {
      const user = await this.userService.getById(id);
      return this.responseSuccess(HttpStatus.OK, null, user);
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
