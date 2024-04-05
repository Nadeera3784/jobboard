import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Document, Types, now } from 'mongoose';

import { Category } from '../../category/schemas/category.schema';
import { Location } from '../../location/schemas/location.schema';
import { User } from '../../user/schemas/user.schema';

@Schema({
  versionKey: false,
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

  @Prop({ type: Types.ObjectId, ref: Category.name, index: true })
  @IsNotEmpty()
  category: Category;

  @Prop({ type: Types.ObjectId, ref: Location.name, index: true })
  @IsNotEmpty()
  location: Location;

  @Prop({ type: Types.ObjectId, ref: User.name, index: true })
  @IsNotEmpty()
  user: User;

  @Prop({ index: true })
  @IsString()
  @IsNotEmpty()
  remote: string;

  @Prop({ index: true })
  @IsString()
  @IsNotEmpty()
  job_type: string;

  @Prop({ index: true })
  @IsString()
  @IsNotEmpty()
  experience_level: string;

  @Prop({ default: 'Active' })
  @IsOptional()
  status: string;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.index({ name: 1 });
