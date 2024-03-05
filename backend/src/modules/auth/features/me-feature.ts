import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
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
      const user = await this.userService.getById(id, '_id name email phone image created_at');
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        null,
        user
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
}
