import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class CreateUserFeature extends BaseFeature {
  constructor(private readonly userService: UserService) {
    super();
  }

  public async handle(createUserDto: CreateUserDto) {
    try {
      await this.userService.create(createUserDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'User has been created successfully',
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
