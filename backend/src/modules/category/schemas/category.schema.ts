import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Document, now } from 'mongoose';

@Schema({
  versionKey: false,
})
export class Category extends Document {
  @Prop({ unique: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);