import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RegisterAttempt } from '../schemas';

@Injectable()
export class RegisterAttemptService {
  constructor(
    @InjectModel(RegisterAttempt.name)
    private readonly registerAttempttModel: Model<RegisterAttempt>,
  ) {}

  public async logAttempt(userId: string, ipAddress: string): Promise<any> {
    return this.registerAttempttModel.create({ user: userId, ipAddress });
  }

  public async clearRegisterAttemptsByIpAddress(
    ipAddress: string,
  ): Promise<any> {
    return this.registerAttempttModel.deleteMany({
      ipAddress,
    });
  }

  public async clearRegisterAttemptsByUserId(userId: string): Promise<any> {
    return this.registerAttempttModel.deleteMany({
      userId,
    });
  }
}
