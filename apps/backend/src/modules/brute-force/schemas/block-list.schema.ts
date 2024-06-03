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
