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

@Schema({
  versionKey: false,
})
export class User extends Document {
  @Prop()
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @Prop({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ default: null })
  @MaxLength(10)
  @IsOptional()
  phone: string;

  @Prop()
  @IsNotEmpty()
  password: string;

  @Prop({ default: null })
  @IsString()
  @IsOptional()
  image: string;

  @Prop({ enum: Roles, default: Roles.USER })
  @IsNotEmpty()
  role: string;

  @Prop({ default: null })
  @IsOptional()
  email_verified: Date;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
