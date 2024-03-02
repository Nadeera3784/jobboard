import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UpdateUserFeature extends BaseFeature {
  constructor(private readonly userService: UserService) {
    super();
  }

  public async handle(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.userService.update(id, updateUserDto);
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'User has been updated successfully',
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
