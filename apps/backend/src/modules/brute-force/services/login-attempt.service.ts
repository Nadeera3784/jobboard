import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LoginAttempt } from '../schemas';

@Injectable()
export class LoginAttemptService {
  constructor(
    @InjectModel(LoginAttempt.name)
    private readonly loginAttemptModel: Model<LoginAttempt>,
  ) {}

  public async logAttempt(
    userId: string,
    ipAddress: string,
    success: boolean,
  ): Promise<any> {
    return await this.loginAttemptModel.create({
      user: userId,
      success: success,
      ip_address: ipAddress,
    });
  }

  public async clearLoginFailures(
    userId: string,
    ipAddress: string,
  ): Promise<any> {
    return await this.loginAttemptModel.deleteMany({
      success: false,
      $or: [{ ip_address: ipAddress }, { user: userId }],
    });
  }
}
