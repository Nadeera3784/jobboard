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
import { TWENTY_MINUTES_IN_SECONDS } from '../constants/bruteforce';

@Schema({
  versionKey: false,
})
export class LoginAttempt extends Document {
  @Prop()
  @IsString()
  @IsOptional()
  ip_address: string;

  @Prop()
  @IsBoolean()
  @IsNotEmpty()
  success: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  @IsOptional()
  user: User;

  @Prop({ expires: TWENTY_MINUTES_IN_SECONDS, default: now() })
  @IsOptional()
  created_at: Date;
}

export const LoginAttemptSchema = SchemaFactory.createForClass(LoginAttempt);

LoginAttemptSchema.index({ user: 1 });

LoginAttemptSchema.statics.logAttempt = async function (
  userId: string,
  ipAddress: string,
  success: boolean,
): Promise<any> {
  return this.create({ user: userId, success, ipAddress });
};

LoginAttemptSchema.statics.clearLoginFailures = async function (
  userId: string,
  ipAddress: string,
): Promise<void> {
  return this.deleteMany({
    success: false,
    $or: [{ ipAddress }, { user: userId }],
  });
};
