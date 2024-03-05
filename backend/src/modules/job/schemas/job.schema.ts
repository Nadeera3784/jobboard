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

  @Prop({ default: 'Active' })
  @IsOptional()
  status: string;

  @Prop({type: Types.ObjectId, ref: Category.name})
  @IsNotEmpty()
  category: Category;

  @Prop({type: Types.ObjectId, ref: Location.name})
  @IsNotEmpty()
  location: Location;

  @Prop({type: Types.ObjectId, ref: User.name})
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

  @Prop()
  @IsNotEmpty()
  expires: Date;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
