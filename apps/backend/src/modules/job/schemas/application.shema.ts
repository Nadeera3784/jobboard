import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Document, SchemaTypes, now } from 'mongoose';

import { Job } from '../../job/schemas/job.schema';
import { User } from '../../user/schemas/user.schema';
import { ApplicationStatusEnum } from '../enums';

@Schema({
  versionKey: false,
  autoIndex: true,
})
export class Application extends Document {
  @Prop({ type: SchemaTypes.ObjectId, ref: Job.name })
  @IsNotEmpty()
  job: Job;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  @IsNotEmpty()
  user: User;

  @Prop({ default: ApplicationStatusEnum.APPLICATION_SUBMITTED })
  @IsOptional()
  status: string;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

ApplicationSchema.index({ job: 1, user: 1 });
