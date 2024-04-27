import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsObject,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { Document, now } from 'mongoose';
import { Roles } from '../enums/roles.enum';
import { Exclude } from 'class-transformer';

@Schema({
  versionKey: false,
})
export class User extends Document {
  @Prop()
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @Prop({ index: true, unique: true })
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

  @Prop({
    type: { _id: false, key: { type: String }, value: { type: String } },
    default: null,
  })
  @IsObject()
  @IsOptional()
  image?: {
    key: string;
    value: string;
  };

  @Prop({ enum: Roles, default: Roles.USER })
  @IsOptional()
  role: string;

  @Prop({ default: 'Active' })
  @IsOptional()
  status: string;

  @Prop({ default: null })
  @IsOptional()
  email_verified: Date;

  @Prop({ default: now(), select: false })
  @IsOptional()
  created_at: Date;

  @Prop({ default: now(), select: false })
  @IsOptional()
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.method('isAdmin', function (this: User): boolean {
  return !!this?.role && this.role === Roles.ADMIN;
});
