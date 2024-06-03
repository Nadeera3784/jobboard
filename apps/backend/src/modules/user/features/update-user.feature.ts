import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
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
        'User has been updated successfully',
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
