import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { SignupDto } from '../dtos/sign-up.dto';
import { UserRegisterdEvent } from '../events/user-registerd.event';
import { VerificationTokenService } from '../services/verification-token.service';
import { BaseFeature } from '../../core/features/base-feature';
import { UserService } from '../../user/services/user.service';
import Events from '../constants/events.constants'

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
      await this.publishEvents(isRegistered);
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

  private async publishEvents(user) {
    const userRegisterdEvent = new UserRegisterdEvent();
    const verificationToken =
      await this.verificationTokenService.generateVerificationToken(user.email);
    userRegisterdEvent.token = verificationToken.token;
    userRegisterdEvent.email = verificationToken.email;
    this.eventEmitter.emit(Events.USER_REGISTERED, userRegisterdEvent);
  }
}
