import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Document, now } from 'mongoose';

import { CategoryStatus } from '../enums';

@Schema({
  versionKey: false,
})
export class Category extends Document {
  @Prop({ unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ default: CategoryStatus.ACTIVE })
  @IsOptional()
  status: string;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ name: 1 });
