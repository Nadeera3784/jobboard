import { Injectable, HttpStatus } from '@nestjs/common';
import { EventDispatcher } from '../../core/event-dispatcher';

import { SignupDto } from '../dtos';
import { UserRegisterdEvent } from '../events/user-registerd.event';
import { VerificationTokenService } from '../services';
import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../../user/services/user.service';
import { USER_REGISTERED } from '../../user/constants';
import { User } from '../../user/schemas/user.schema';

@Injectable()
export class SignUpFeature extends BaseFeature {
  constructor(
    private readonly tokenService: VerificationTokenService,
    private readonly userService: UserService,
    private eventDispatcher: EventDispatcher,
  ) {
    super();
  }

  public async handle(signupDto: SignupDto) {
    try {
      const user = await this.userService.create(signupDto);
      await this.dispatchEvent(user);
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

  private async dispatchEvent(user: User) {
    const verificationToken = await this.tokenService.generateVerificationToken(
      user.email,
    );
    const event: UserRegisterdEvent = {
      token: verificationToken.token,
      email: verificationToken.email,
    };
    this.eventDispatcher.dispatch(USER_REGISTERED, event);
  }
}
