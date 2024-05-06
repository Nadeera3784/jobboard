import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { ConfigService } from '@nestjs/config';

import { SecurityQuestionService } from './security-question.service';
import {
  BlockList,
  LoginAttempt,
  RegisterAttempt,
  SecurityQuestionAttempt,
} from '../schemas';
import { UserService } from '../../user/services/user.service';
import {
  LoginAttemptService,
  RegisterAttemptService,
  BlockListService,
} from '../services';
import {
  MAX_LOGIN_FAILURES,
  MAX_REGISTER_ATTEMPTS,
  MAX_REGISTER_ATTEMPTS_NEXT,
  MAX_SECURITY_QUESTION_FAILURES,
  THREE_HOURS,
  TWENTY_MINUTES,
} from '../constants/bruteforce.constants';
import {
  MAX_BAN_COUNT,
  SECURITY_QUESTION_BAN,
} from '../constants/ban-reasons.constants';
import { UtilityService } from '../../../modules/app/services';
import { User } from '../../user/schemas/user.schema';
import {
  BanRegistrationsEnum,
  getRegistrationBanFromCount,
} from '../enums/ban-register.enum';
import { BlockedException, RegisterBlockedException } from '../exceptions';
import {
  BanReasonsEnum,
  getReasonFromBanCount,
} from '../enums/ban-reasons.enum';
import { UserStatusEnum } from '../../user/enums';

@Injectable()
export class SuspiciousActivityService {
  constructor(
    @InjectModel(LoginAttempt.name)
    private readonly loginAttemptModel: Model<LoginAttempt>,
    @InjectModel(BlockList.name)
    private readonly blockListModel: Model<BlockList>,
    @InjectModel(RegisterAttempt.name)
    private readonly registerAttemptModel: Model<RegisterAttempt>,
    @InjectModel(SecurityQuestionAttempt.name)
    private readonly securityQuestionAttemptModel: Model<SecurityQuestionAttempt>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly securityQuestionService: SecurityQuestionService,
    private readonly loginAttemptService: LoginAttemptService,
    private readonly registerAttemptService: RegisterAttemptService,
    private readonly blockListService: BlockListService,
    private configService: ConfigService,
  ) {}

  public async checkLoginSuspiciousActivity(
    userId: string,
    userEmail: string,
    ipAddress: string,
  ): Promise<number | never> {
    if (!this.configService.get('app.enable_bruteforce_protection')) {
      return;
    }

    const isPermanentlyBlocked: boolean =
      await this.blockListService.isPermanentlyBlocked(userId, ipAddress);
    if (isPermanentlyBlocked) {
      throw new BlockedException(BanReasonsEnum.REASON_PERMANENT_BAN);
    }
    const maxBlock: number = await this.blockListService.getActiveBanCount(
      userId,
      ipAddress,
    );
    if (userEmail && maxBlock === 1) {
      const user: any = await this.userModel.findOne({
        email: userEmail,
        status: UserStatusEnum.INACTIVE,
      });
      if (user) {
        return maxBlock;
      }
    }
    if (maxBlock > 1) {
      const banReason: BanReasonsEnum = getReasonFromBanCount(maxBlock);
      throw new BlockedException(banReason);
    }
    return this.bruteforceBanCountLogin(userId, ipAddress);
  }

  public async checkSecurityQuestionSuspiciousActivity(
    userId: string,
    ipAddress: string,
  ): Promise<number | never> {
    if (!this.configService.get('app.enable_bruteforce_protection')) {
      return;
    }
    const maxBlock: number = await this.blockListService.getActiveBanCount(
      userId,
      ipAddress,
    );
    if (maxBlock > 1) {
      throw new UnauthorizedException(SECURITY_QUESTION_BAN);
    }
    return this.bruteforceBanCountSecurityQuestion(userId, ipAddress);
  }

  public async checkRegisterSuspiciousActivity(
    ipAddress: string,
  ): Promise<number | never> {
    if (!this.configService.get('app.enable_bruteforce_protection')) {
      return;
    }
    const isPermanentlyBlocked: boolean =
      await this.blockListService.isIpBlocked(ipAddress);
    if (isPermanentlyBlocked) {
      throw new RegisterBlockedException(
        BanRegistrationsEnum.REGISTRATION_PERMANENT_BAN,
      );
    }
    const maxBlock: number = await this.blockListService.getActiveBanCount(
      null,
      ipAddress,
    );
    if (maxBlock > 1) {
      const banReason: BanRegistrationsEnum =
        getRegistrationBanFromCount(maxBlock);
      throw new RegisterBlockedException(banReason);
    }
    return this.bruteforceBanCountRegister(ipAddress, maxBlock);
  }

  public async clearLoginFailures(
    userId: string,
    ipAddress: string,
  ): Promise<void> {
    await this.loginAttemptService.clearLoginFailures(userId, ipAddress);
  }

  public async removeUserFromBlockList(userId: string): Promise<void> {
    await this.blockListModel.deleteMany({ user: userId });
  }

  public async blockIp(userIp: string): Promise<void> {
    const blockedModel: BlockList = await this.blockListModel.findOneAndUpdate(
      { ip_address: UtilityService.encodeUsersIpAddress(userIp, '') },
      {
        $inc: { ban_count: 1 },
        $set: {
          blocked_to_date: new Date(),
          permanently: true,
        },
      },
    );
    if (!blockedModel) {
      await this.blockListModel.create({
        ban_count: 1,
        blocked_to_date: new Date(),
        ip_address: UtilityService.encodeUsersIpAddress(userIp, ''),
        permanently: true,
      });
    }
  }

  public async unblockUser(userId?: string, userIp?: string): Promise<void> {
    if (
      UtilityService.isValidString(userIp) &&
      UtilityService.isValidString(userId)
    ) {
      const user: User = await this.userService.getById(userId);
      const email: string = user.email;
      const encodedIp: string = UtilityService.encodeUsersIpAddress(
        userIp,
        email,
      );
      await this.clearUserActivities(userId, encodedIp);
    } else if (UtilityService.isValidString(userId)) {
      await this.clearUserActivitiesById(userId);
    } else if (UtilityService.isValidString(userIp)) {
      const encodedIp: string = UtilityService.encodeUsersIpAddress(userIp, '');
      await this.clearUserActivitiesByIp(encodedIp);
    }
  }

  public async clearAllActivities(): Promise<void> {
    await this.clearAllRegisterFailures();
    await this.clearAllLoginFailures();
    await this.clearAllSecurityQuestionFailures();
    await this.clearAllBlockedLists();
  }

  public async isIpBlockedPermanently(ipAddress: string): Promise<boolean> {
    return !!(await this.blockListModel.findOne({
      ip_address: UtilityService.encodeUsersIpAddress(ipAddress, ''),
      permanently: true,
    }));
  }

  private async bruteforceBanCountLogin(
    userId: string,
    ipAddress: string,
  ): Promise<number> {
    const query: any = {
      ipAddress,
      success: false,
    };
    if (userId) {
      query.user = userId;
    }
    const promises: Array<Query<number, any>> = [
      this.loginAttemptModel.countDocuments(query),
    ];
    if (userId) {
      promises.push(
        this.loginAttemptModel.countDocuments({
          success: false,
          user: userId,
        }),
      );
    }
    const [ipAddressFailures, userFailures]: number[] = await Promise.all(
      promises,
    );
    if (
      userFailures > MAX_LOGIN_FAILURES ||
      ipAddressFailures > MAX_LOGIN_FAILURES
    ) {
      return (await this.blockLogin(userId, ipAddress)).ban_count;
    }
    return 0;
  }

  private async blockLogin(
    userId?: string,
    ipAddress?: string,
  ): Promise<BlockList> {
    let nextBlock: number =
      (await this.blockListService.getMaxBlockIn24Hrs(userId, ipAddress)) + 1;
    if (await this.isLoginBruteforced(userId)) {
      nextBlock++;
    }
    await this.loginAttemptService.clearLoginFailures(userId, ipAddress);
    let blockedToDate: Date = new Date(new Date().getTime() + TWENTY_MINUTES);
    if (nextBlock > 2) {
      blockedToDate = new Date(new Date().getTime() + THREE_HOURS);
    }
    if (nextBlock === MAX_BAN_COUNT) {
      return this.blockListModel.create({
        ban_count: nextBlock,
        blockedToDate,
        ipAddress,
        permanently: true,
        user: userId,
      });
    }

    return this.blockListModel.create({
      ban_count: nextBlock,
      blockedToDate,
      ipAddress,
      user: userId,
    });
  }

  private async isLoginBruteforced(userId?: string): Promise<boolean> {
    const loginAttempts: LoginAttempt[] = await this.loginAttemptModel
      .find({ user: userId })
      .exec();
    let ipAddress: string;
    for (const loginAttempt of loginAttempts) {
      if (loginAttempt.ip_address) {
        if (ipAddress && ipAddress !== loginAttempt.ip_address) {
          return true;
        }
        ipAddress = loginAttempt.ip_address;
      }
    }
    return false;
  }

  private async bruteforceBanCountRegister(
    ipAddress: string,
    maxBlock: number,
  ): Promise<number> {
    const ipAddressFailures: number = await this.registerAttemptModel
      .countDocuments({
        ipAddress,
      })
      .exec();

    if (ipAddressFailures > MAX_REGISTER_ATTEMPTS) {
      return (await this.blockRegister(ipAddress, maxBlock)).ban_count;
    }

    return maxBlock;
  }

  private async blockRegister(
    ipAddress: string,
    maxBlock: number,
  ): Promise<BlockList> {
    let nextBlock: number =
      (await this.blockListService.getMaxBlockIn24Hrs(null, ipAddress)) + 1;

    if (await this.isRegisterBruteforced(ipAddress)) {
      nextBlock++;
    }
    if (nextBlock === 1 && maxBlock === 1) {
      nextBlock++;
    }
    let blockedToDate: Date = new Date(new Date().getTime() + TWENTY_MINUTES);
    await this.registerAttemptService.clearRegisterAttemptsByIpAddress(
      ipAddress,
    );
    if (nextBlock > 2) {
      blockedToDate = new Date(new Date().getTime() + THREE_HOURS);
    }
    if (nextBlock === MAX_BAN_COUNT) {
      return this.blockListModel.create({
        banCount: nextBlock,
        blockedToDate,
        ipAddress,
        permanently: true,
      });
    }

    return this.blockListModel.create({
      banCount: nextBlock,
      blockedToDate,
      ipAddress,
    });
  }

  private async isRegisterBruteforced(ipAddress?: string): Promise<boolean> {
    if (!ipAddress) {
      return true;
    }
    const registerAttempts: number = await this.registerAttemptModel
      .countDocuments({ ipAddress })
      .exec();
    return registerAttempts > MAX_REGISTER_ATTEMPTS_NEXT;
  }

  private async bruteforceBanCountSecurityQuestion(
    userId: string,
    ipAddress: string,
  ): Promise<number> {
    const query: any = {
      ipAddress,
      success: false,
    };
    if (userId) {
      query.user = userId;
    }
    const promises: Array<Query<number, any>> = [
      this.securityQuestionAttemptModel.countDocuments(query),
    ];

    if (userId) {
      promises.push(
        this.securityQuestionAttemptModel.countDocuments({
          success: false,
          user: userId,
        }),
      );
    }
    const [ipAddressFailures, userFailures]: number[] = await Promise.all(
      promises,
    );
    if (
      userFailures > MAX_SECURITY_QUESTION_FAILURES ||
      ipAddressFailures > MAX_SECURITY_QUESTION_FAILURES
    ) {
      return (await this.blockSecurityQuestion(userId, ipAddress)).ban_count;
    }
    return 0;
  }

  private async blockSecurityQuestion(
    userId?: string,
    ipAddress?: string,
  ): Promise<BlockList> {
    let nextBlock: number =
      (await this.blockListService.getMaxBlockIn24Hrs(userId, ipAddress)) + 1;
    if (await this.isSecurityQuestionBruteforced(userId)) {
      nextBlock++;
    }
    const blockedToDate = new Date(new Date().getTime() + THREE_HOURS);
    return this.blockListModel.create({
      ban_count: nextBlock,
      blockedToDate,
      ipAddress,
      user: userId,
    });
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

  private async clearUserActivities(
    userId: string,
    encodedIp: string,
  ): Promise<void> {
    await this.blockListModel.deleteMany({
      ip_address: encodedIp,
      user: userId,
    });
    await this.registerAttemptModel.deleteMany({
      ip_address: encodedIp,
      user: userId,
    });
    await this.loginAttemptModel.deleteMany({
      ip_address: encodedIp,
      user: userId,
    });
    await this.securityQuestionAttemptModel.deleteMany({
      ip_address: encodedIp,
      user: userId,
    });
  }

  private async clearUserActivitiesByIp(encodedIp: string): Promise<void> {
    await this.blockListModel.deleteMany({ ip_address: encodedIp });
    await this.registerAttemptService.clearRegisterAttemptsByIpAddress(
      encodedIp,
    );
    await this.loginAttemptService.clearLoginFailures(null, encodedIp);
    await this.securityQuestionService.clearLoginFailures(null, encodedIp);
  }

  private async clearUserActivitiesById(userId: string): Promise<void> {
    await this.blockListModel.deleteMany({ user: userId });
    await this.registerAttemptService.clearRegisterAttemptsByUserId(userId);
    await this.loginAttemptService.clearLoginFailures(userId, null);
    await this.securityQuestionService.clearLoginFailures(userId, null);
  }
}
