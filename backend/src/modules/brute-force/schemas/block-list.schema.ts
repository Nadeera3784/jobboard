import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Document, SchemaTypes, now } from 'mongoose';

import { User } from '../../user/schemas/user.schema';
import { TWENTY_FOUR_HOURS } from '../constants/bruteforce';

@Schema({
  versionKey: false,
})
export class BlockList extends Document {
  @Prop()
  @IsNumber()
  @IsNotEmpty()
  ban_count: number;

  @Prop({ type: Date })
  @IsOptional()
  blocked_to_date: Date;

  @Prop()
  @IsString()
  @IsOptional()
  ip_address: string;

  @Prop()
  @IsBoolean()
  @IsOptional()
  permanently: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  @IsOptional()
  user: User;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;
}

export const BlockListSchema = SchemaFactory.createForClass(BlockList);

BlockListSchema.statics.isPermanentlyBlocked = async function (
  userId: string,
  ipAddress: string,
): Promise<boolean> {
  return (
    (await this.countDocuments({
      $or: [{ ipAddress }, { user: userId }],
      permanently: true,
    })) > 0
  );
};

BlockListSchema.statics.isIpBlocked = async function (
  ipAddress: string,
): Promise<boolean> {
  return (
    (await this.countDocuments({
      ipAddress,
      permanently: true,
    })) > 0
  );
};

BlockListSchema.statics.getActiveBanCount = async function (
  userId: string,
  ipAddress: string,
): Promise<number> {
  const filters: any = [];

  if (ipAddress) {
    filters.push({ ipAddress });
  }

  if (userId) {
    filters.push({ user: userId });
  }

  const record: BlockList = await this.findOne(
    {
      $or: filters,
      blocked_to_date: { $gte: new Date() },
    },
    null,
    { sort: { ban_count: -1 } },
  );

  return record ? record.ban_count : 0;
};

BlockListSchema.statics.isIpBlocked = async function (
  ipAddress: string,
): Promise<boolean> {
  return (
    (await this.countDocuments({
      ipAddress,
      permanently: true,
    })) > 0
  );
};

BlockListSchema.statics.getActiveBanCount = async function (
  userId: string,
  ipAddress: string,
): Promise<number> {
  const filters: any = [];

  if (ipAddress) {
    filters.push({ ipAddress });
  }

  if (userId) {
    filters.push({ user: userId });
  }

  const record: BlockList = await this.findOne(
    {
      $or: filters,
      blocked_to_date: { $gte: new Date() },
    },
    null,
    { sort: { ban_count: -1 } },
  );

  return record ? record.ban_count : 0;
};

BlockListSchema.statics.getMaxBlockIn24Hrs = async function (
  userId: string,
  ipAddress: string,
): Promise<number> {
  const maxBlock: BlockList = await this.findOne(
    {
      $or: [{ ipAddress }, { user: userId }],
      created_at: { $gte: new Date().getTime() - TWENTY_FOUR_HOURS },
    },
    null,
    { sort: { ban_count: -1 } },
  );

  return maxBlock ? maxBlock.ban_count : 0;
};
