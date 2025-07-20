import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EventDispatcher } from '../../core/event-dispatcher';

import { SignInDto } from '../dtos';
import { UserRegisterdEvent } from '../events/user-registerd.event';
import { Feature } from '../../app/features/feature';
import { UserService } from '../../user/services/user.service';
import { UtilityService } from '../../app/services';
import {
  USER_REGISTERED,
  USER_UPDATED,
  USER_DATE_SYNC,
} from '../../user/constants';
import { VerificationTokenService } from '../services';
import { UserUpdatedEvent } from '../../user/events';
import { SuspiciousActivityService } from '../../brute-force/services/suspicious-activity.service';
import { RequestFingerprint } from '../../app/interfaces/request-fingerprint.interface';
import { RequestParser } from '../../app/services/request-parser.service';
import { UserLoginEvent } from '../events/user-login-event';
import { USER_LOGIN_EVENT } from '../constants';
import { ObjectId } from 'mongoose';

@Injectable()
export class SignInFeature extends Feature {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenService: VerificationTokenService,
    private readonly suspiciousActivityService: SuspiciousActivityService,
    private eventDispatcher: EventDispatcher,
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

      const isValidPassword = await UtilityService.isPasswordValid(
        signInDto.password,
        user.password,
      );

      const loginEvent: UserLoginEvent = {
        user,
        parsedRequest,
        signInDto,
        isValidPassword,
      };

      this.eventDispatcher.dispatch(USER_LOGIN_EVENT, loginEvent);

      if (isValidPassword) {
        /*
        TODO:add two factor authentication reponse
        if(user.is_two_factor_authentication_enabled){

        }
        */

        const payload = { id: user._id };

        const accessToken = this.jwtService.sign(payload);

        await this.dispatchDateSyncEvent(user._id as ObjectId);

        await this.suspiciousActivityService.removeUserFromBlockList(user._id.toString());

        await this.suspiciousActivityService.clearLoginFailures(user._id.toString(), null);

        return this.responseSuccess(HttpStatus.OK, 'Login successfully', {
          type: 'Bearer',
          access_token: accessToken,
          redirect_identifier: user.role,
        });
      } else {
        return this.responseError(HttpStatus.UNAUTHORIZED, 'Invalid credentials');
      }
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }

  private async dispatchVerificationEvent(email: string) {
    const verificationToken = await this.tokenService.generateVerificationToken(
      email,
    );
    const event: UserRegisterdEvent = {
      token: verificationToken.token,
      email: verificationToken.email,
    };
    this.eventDispatcher.dispatch(USER_REGISTERED, event);
  }

  private async dispatchDateSyncEvent(id: ObjectId) {
    const event: UserUpdatedEvent = { type: USER_DATE_SYNC, id: id };
    this.eventDispatcher.dispatch(USER_UPDATED, event);
  }
}
