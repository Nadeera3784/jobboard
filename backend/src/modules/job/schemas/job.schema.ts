import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Document, SchemaTypes, now } from 'mongoose';
import * as moment from 'moment';

import { Category } from '../../category/schemas/category.schema';
import { Location } from '../../location/schemas/location.schema';
import { User } from '../../user/schemas/user.schema';

@Schema({
  versionKey: false,
  autoIndex: true,
})
export class Job extends Document {
  @Prop({ unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: Category.name })
  @IsNotEmpty()
  category: Category;

  @Prop({ type: SchemaTypes.ObjectId, ref: Location.name })
  @IsNotEmpty()
  location: Location;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  @IsNotEmpty()
  user: User;

  @Prop()
  @IsString()
  @IsNotEmpty()
  remote: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  job_type: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  experience_level: string;

  @Prop({ default: 'Active' })
  @IsOptional()
  status: string;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;

  @Prop({ default: () => moment().add(1, 'months').toDate() })
  @IsOptional()
  expired_at: Date;

  countAppliedJobs: Function;
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({ name: 1, category: 1, location: 1 });
