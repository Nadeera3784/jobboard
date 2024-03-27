import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Document, now } from 'mongoose';
import { Roles } from '../enums/roles.enum';
import { Exclude } from 'class-transformer';

@Schema({
  versionKey: false
})
export class User extends Document {
  @Prop()
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @Prop({ index : true,  unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ default: null })
  @MaxLength(10)
  @IsOptional()
  phone: string;

  @Prop()
  @IsNotEmpty()
  @Exclude()
  password: string;

  @Prop({ default: null})
  @IsString()
  @IsOptional()
  image: string;

  @Prop({ enum: Roles, default: Roles.USER })
  @IsOptional()
  role: string;

  @Prop({ default: 'Active' })
  @IsOptional()
  status: string;

  @Prop({ default: null })
  @IsOptional()
  email_verified: Date;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);