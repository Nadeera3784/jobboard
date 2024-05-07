import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SecurityQuestionAttempt } from '../schemas';

@Injectable()
export class SecurityQuestionService {
  constructor(
    @InjectModel(SecurityQuestionAttempt.name)
    private readonly securityQuestionAttemptModel: Model<SecurityQuestionAttempt>,
  ) {}

  public async logAttempt(
    userId: string,
    ipAddress: string,
    success: boolean,
  ): Promise<any> {
    return this.securityQuestionAttemptModel.create({
      user: userId,
      success: success,
      ip_address: ipAddress,
    });
  }

  public async clearLoginFailures(
    userId: string,
    ipAddress: string,
  ): Promise<void> {
    await this.securityQuestionAttemptModel.deleteMany({
      success: false,
      $or: [{ ip_address: ipAddress }, { user: userId }],
    });
  }
}
