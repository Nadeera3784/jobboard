import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Document, now } from 'mongoose';

import { LoctionStatus } from '../enums';

@Schema({
  versionKey: false,
})
export class Location extends Document {
  @Prop({ unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ default: LoctionStatus.ACTIVE })
  @IsOptional()
  status: string;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.index({ name: 1 });
