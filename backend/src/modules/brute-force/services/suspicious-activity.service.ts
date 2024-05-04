import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { SecurityQuestionService } from './security-question.service';
import {
  BlockList,
  LoginAttempt,
  RegisterAttempt,
  SecurityQuestionAttempt,
} from '../schemas';
import { User } from 'src/modules/user/schemas/user.schema';
import { Model, Query } from 'mongoose';
import {
  MAX_LOGIN_FAILURES,
  MAX_REGISTER_ATTEMPTS_NEXT,
  THREE_HOURS,
} from '../constants/bruteforce';

@Injectable()
export class SuspiciousActivityService {
  constructor(
    private readonly securityQuestionService: SecurityQuestionService,
    @InjectModel(LoginAttempt.name)
    private readonly loginAttemptModel: Model<LoginAttempt>,
    @InjectModel(BlockList.name)
    private readonly blockListModel: Model<BlockList>,
    @InjectModel(RegisterAttempt.name)
    private readonly registerAttemptModel: Model<RegisterAttempt>,
    @InjectModel(SecurityQuestionAttempt.name)
    private readonly securityQuestionAttemptModel: Model<SecurityQuestionAttempt>,
    @InjectModel(User.name) private readonly employeeModel: Model<User>,
  ) {}

  private async isRegisterBruteforced(ipAddress?: string): Promise<boolean> {
    if (!ipAddress) {
      return true;
    }
    const registerAttempts: number = await this.registerAttemptModel
      .countDocuments({ ipAddress })
      .exec();
    return registerAttempts > MAX_REGISTER_ATTEMPTS_NEXT;
  }

  private async isSecurityQuestionBruteforced(
    userId?: string,
  ): Promise<boolean> {
    const attempts: SecurityQuestionAttempt[] =
      await this.securityQuestionAttemptModel.find({ user: userId }).exec();

    let ipAddress: string;
    for (const attempt of attempts) {
      if (attempt.ip_address) {
        if (ipAddress && ipAddress !== attempt.ip_address) {
          return true;
        }
        ipAddress = attempt.ip_address;
      }
    }
    return false;
  }

  private async clearAllLoginFailures(): Promise<void> {
    await this.loginAttemptModel.deleteMany({});
  }

  private async clearAllRegisterFailures(): Promise<void> {
    await this.registerAttemptModel.deleteMany({});
  }

  private async clearAllSecurityQuestionFailures(): Promise<void> {
    await this.securityQuestionAttemptModel.deleteMany({});
  }

  private async clearAllBlockedLists(): Promise<void> {
    await this.blockListModel.deleteMany({});
  }
}
