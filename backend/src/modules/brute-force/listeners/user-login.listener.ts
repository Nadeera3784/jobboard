import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { LoginAttempt } from '../schemas';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SuspiciousActivityService } from '../services';
import { RESET_PASSWORD } from 'src/modules/authentication/constants';
import { UserLoginEvent } from '../events/user-login-event';
import { UtilityService } from '../../app/services/utility.service';

@Injectable()
export class UserLoginListener {
  constructor(
    private readonly bruteForceService: SuspiciousActivityService,
    @InjectModel(LoginAttempt.name)
    private readonly loginAttemptModel: Model<LoginAttempt>,
  ) {}

  @OnEvent('')
  async handleUserLoginEvent(event: UserLoginEvent) {}
}
