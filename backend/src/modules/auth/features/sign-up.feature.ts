import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { AuthService } from '../services/auth.service';
import { Response as ResponseType } from '../../app/enums/response.enum';
import { SignupDto } from '../dtos/sign-up.dto';
import { UserRegisterdEvent } from '../events/user-registerd.event';
import { TokenService } from '../services/token.service';
import { BaseFeature } from '../../core/features/base-feature';

@Injectable()
export class SignUpFeature extends BaseFeature {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  public async handle(signupDto: SignupDto) {
    try {
      const isRegistered = await this.authService.signUp(signupDto);
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
    const verificationToken = await this.tokenService.generateVerificationToken(
      user.email,
    );
    userRegisterdEvent.token = verificationToken.token;
    userRegisterdEvent.email = verificationToken.email;
    this.eventEmitter.emit('user.registerd', userRegisterdEvent);
  }
}
