import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../services/user.service';

@Injectable()
export class DatatableFeature extends BaseFeature {
  constructor(private readonly userService: UserService) {
    super();
  }

  public async handle(request) {
    try {
      const data = await this.userService.datatable(request);
      return this.responseSuccess(
        HttpStatus.OK,
        null,
        data
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
