import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlockList } from '../schemas';
import { Model } from 'mongoose';
import { TWENTY_FOUR_HOURS } from '../constants/bruteforce.constants';

@Injectable()
export class BlockListService {
  constructor(
    @InjectModel(BlockList.name)
    private readonly loginAttemptModel: Model<BlockList>,
  ) {}

  public async isPermanentlyBlocked(
    userId: string,
    ipAddress: string,
  ): Promise<boolean> {
    return (
      (await this.loginAttemptModel.countDocuments({
        $or: [{ ip_address: ipAddress }, { user: userId }],
        permanently: true,
      })) > 0
    );
  }

  public async isIpBlocked(ipAddress: string): Promise<boolean> {
    return (
      (await this.loginAttemptModel.countDocuments({
        ip_address: ipAddress,
        permanently: true,
      })) > 0
    );
  }

  public async getActiveBanCount(
    userId: string,
    ipAddress: string,
  ): Promise<number> {
    const filters: any = [];

    if (ipAddress) {
      filters.push({ ipAddress: ipAddress });
    }

    if (userId) {
      filters.push({ user: userId });
    }

    const record: BlockList = await this.loginAttemptModel.findOne(
      {
        $or: filters,
        blocked_to_date: { $gte: new Date() },
      },
      null,
      { sort: { ban_count: -1 } },
    );

    return record ? record.ban_count : 0;
  }

  public async getMaxBlockIn24Hrs(
    userId: string,
    ipAddress: string,
  ): Promise<number> {
    const maxBlock: BlockList = await this.loginAttemptModel.findOne(
      {
        $or: [{ ip_address: ipAddress }, { user: userId }],
        created_at: { $gte: new Date().getTime() - TWENTY_FOUR_HOURS },
      },
      null,
      { sort: { ban_count: -1 } },
    );
    return maxBlock ? maxBlock.ban_count : 0;
  }
}
