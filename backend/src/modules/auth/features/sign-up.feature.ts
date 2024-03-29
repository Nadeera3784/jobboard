import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { SignupDto } from '../dtos';
import { UserRegisterdEvent } from '../events/user-registerd.event';
import { VerificationTokenService } from '../services';
import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../../user/services/user.service';
import { Events } from '../../user/enums/events.enum';

@Injectable()
export class SignUpFeature extends BaseFeature {
  constructor(
    private readonly verificationTokenService: VerificationTokenService,
    private readonly userService: UserService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  public async handle(signupDto: SignupDto) {
    try {
      const isRegistered = await this.userService.create(signupDto);
      if (isRegistered instanceof BadRequestException) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          ResponseType.ERROR,
          isRegistered.message,
        );
      }
      await this.dispatchEvent(isRegistered);
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'User has been created successfully',
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

  private async dispatchEvent(user) {
    const event = new UserRegisterdEvent();
    const verificationToken =
      await this.verificationTokenService.generateVerificationToken(user.email);
    event.token = verificationToken.token;
    event.email = verificationToken.email;
    this.eventEmitter.emit(Events.USER_REGISTERED, event);
  }
}
