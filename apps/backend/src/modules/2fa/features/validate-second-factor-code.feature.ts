import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { Feature } from '../../app/features/feature';
import { UserService } from '../../user/services/user.service';
import { SecondFactorService } from '../services';
import { SecondFactorDto } from '../dtos';
import { EventDispatcher } from '../../core/event-dispatcher';
import { UserUpdatedEvent } from '../../user/events';
import { USER_UPDATED, USER_DATE_SYNC } from '../../user/constants';
import { SuspiciousActivityService } from '../../brute-force/services/suspicious-activity.service';
import { ObjectId } from 'mongoose';

@Injectable()
export class ValidateSecondFactorCodeFeature extends Feature {
  constructor(
    private readonly userService: UserService,
    private readonly secondFactorService: SecondFactorService,
    private readonly jwtService: JwtService,
    private readonly suspiciousActivityService: SuspiciousActivityService,
    private readonly eventDispatcher: EventDispatcher,
  ) {
    super();
  }

  public async handle(userId: string, dto: SecondFactorDto, request: Request) {
    try {
      const user = await this.userService.getById(userId);

      if (!user) {
        return this.responseError(HttpStatus.BAD_REQUEST, 'User not found');
      }

      if (!user.is_two_factor_authentication_enabled) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          'Two-factor authentication is not enabled for this user',
        );
      }

      const isValid = await this.secondFactorService.validate(
        userId,
        dto.secondFactorCode,
        request as any,
      );

      if (!isValid) {
        return this.responseError(
          HttpStatus.UNAUTHORIZED,
          'Invalid two-factor authentication code',
        );
      }

      const payload = { id: user._id };
      const accessToken = this.jwtService.sign(payload);

      await this.dispatchDateSyncEvent(user._id as ObjectId);

      await this.suspiciousActivityService.removeUserFromBlockList(
        user._id.toString(),
      );

      await this.suspiciousActivityService.clearLoginFailures(
        user._id.toString(),
        null,
      );

      return this.responseSuccess(
        HttpStatus.OK,
        'Two-factor authentication successful',
        {
          type: 'Bearer',
          access_token: accessToken,
          redirect_identifier: user.role,
        },
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }

  private async dispatchDateSyncEvent(id: ObjectId) {
    const event: UserUpdatedEvent = { type: USER_DATE_SYNC, id: id };
    this.eventDispatcher.dispatch(USER_UPDATED, event);
  }
}
