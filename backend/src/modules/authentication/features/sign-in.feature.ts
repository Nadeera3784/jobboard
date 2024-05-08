import { Injectable, HttpStatus } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { SignInDto } from '../dtos';
import { UserRegisterdEvent } from '../events/user-registerd.event';
import { AuthenticationService } from '../services/authentication.service';
import { BaseFeature } from '../../app/features/base-feature';
import { UserService } from '../../user/services/user.service';
import {
  USER_REGISTERED,
  USER_UPDATED,
  USER_DATE_SYNC,
} from '../../user/constants';
import { VerificationTokenService } from '../services';
import { UserUpdatedEvent } from '../../user/events';
import { SuspiciousActivityService } from '../../brute-force/services/suspicious-activity.service';
import { User } from '../../user/schemas/user.schema';
import { RequestFingerprint } from '../../app/interfaces/request-fingerprint.interface';
import { RequestParser } from '../../app/services/request-parser.service';
import { UserLoginEvent } from '../events/user-login-event';
import { USER_LOGIN_EVENT } from '../constants';

@Injectable()
export class SignInFeature extends BaseFeature {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly verificationTokenService: VerificationTokenService,
    private readonly suspiciousActivityService: SuspiciousActivityService,
    private eventDispatcher: EventEmitter2,
  ) {
    super();
  }

  public async handle(request: Request, signInDto: SignInDto) {
    try {
      const user = await this.userService.getByEmail(signInDto.email);
      const parsedRequest: RequestFingerprint = RequestParser.parse(request);
      if (!user) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          'There is no user associated with this email',
        );
      }

      if (!user.email_verified) {
        await this.dispatchVerificationEvent(user.email);
        return this.responseError(
          HttpStatus.UNAUTHORIZED,
          'Please verify your account',
        );
      }

      const isValidPassword = await this.authenticationService.signIn(
        signInDto.password,
        user.password,
      );

      const loginEvent: UserLoginEvent = {
        user,
        parsedRequest,
        signInDto,
        isValidPassword,
      };

      this.eventDispatcher.emit(USER_LOGIN_EVENT, loginEvent);

      if (isValidPassword) {
        const payload = {
          id: user._id,
        };

        const accessToken = this.jwtService.sign(payload);

        await this.dispatchDateSyncEvent(user._id);

        return this.responseSuccess(HttpStatus.OK, 'Login successfully', {
          type: 'Bearer',
          access_token: accessToken,
          redirect_identifier: user.role,
        });
      }

      await this.suspiciousActivityService.removeUserFromBlockList(user._id);

      await this.suspiciousActivityService.clearLoginFailures(user._id, null);

      return this.responseError(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
    } catch (error) {
      console.log('error', error);
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }

  private async dispatchVerificationEvent(email: string) {
    const verificationToken =
      await this.verificationTokenService.generateVerificationToken(email);
    const event: UserRegisterdEvent = {
      token: verificationToken.token,
      email: verificationToken.email,
    };
    this.eventDispatcher.emit(USER_REGISTERED, event);
  }

  private async dispatchDateSyncEvent(id: string) {
    const event: UserUpdatedEvent = { type: USER_DATE_SYNC, id: id };
    this.eventDispatcher.emit(USER_UPDATED, event);
  }

  private async dispatchLoginEvent(user: User) {}
}
