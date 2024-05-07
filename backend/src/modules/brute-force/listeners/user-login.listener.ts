import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import {
  SuspiciousActivityService,
  LoginAttemptService,
} from '../../brute-force/services';
import { USER_LOGIN_EVENT } from '../../authentication/constants';
import { UtilityService } from '../../app/services/utility.service';
import { User } from '../../user/schemas/user.schema';
import { UserLoginEvent } from '../../authentication/events/user-login-event';
import { BlockedException, CaptchaException } from '../exceptions';
import { getReasonFromBanCount } from '../enums/ban-reasons.enum';

@Injectable()
export class UserLoginListener {
  constructor(
    private readonly loginAttemptService: LoginAttemptService,
    private readonly suspiciousActivityService: SuspiciousActivityService,
  ) {}

  @OnEvent(USER_LOGIN_EVENT)
  public async onUserLogAttempt(data: UserLoginEvent): Promise<void> {
    const { userId, userEmail }: any = this.getUserData(data);
    const hashedIpAddress: string = UtilityService.encodeUsersIpAddress(
      data.parsedRequest.ipAddress,
      userEmail,
    );
    await this.loginAttemptService.logAttempt(
      userId,
      hashedIpAddress,
      data.isValidPassword,
    );
  }

  public async onLoginEvent(data: UserLoginEvent): Promise<void> {
    if (!data.user) {
      return;
    }
    const { userId, userEmail }: any = this.getUserData(data);
    const hashedIpAddress: string = UtilityService.encodeUsersIpAddress(
      data.parsedRequest.ipAddress,
      userEmail,
    );
    const banCount: number =
      await this.suspiciousActivityService.checkLoginSuspiciousActivity(
        userId,
        userEmail,
        hashedIpAddress,
      );

    if (banCount === 1 && !data.isValidPassword) {
      throw new CaptchaException();
    }
    if (banCount > 1) {
      throw new BlockedException(getReasonFromBanCount(banCount));
    }
  }

  private getUserData(data: UserLoginEvent): {
    userId: string;
    userEmail: string;
  } {
    let userId: string = null;
    let userEmail: string = null;
    const user: User = data.user;
    if (user) {
      userId = user._id;
      userEmail = user.email;
    }
    return { userId, userEmail };
  }
}
