import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsObject,
  MaxLength,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Document, now } from 'mongoose';
import { RolesEnum, UserStatusEnum } from '../enums';
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

  @Prop({ enum: RolesEnum, default: RolesEnum.USER })
  @IsOptional()
  role: string;

  @Prop({ default: UserStatusEnum.ACTIVE })
  @IsOptional()
  status: string;

  @Prop({ default: null })
  @IsOptional()
  email_verified: Date;

  @Prop({ default: false })
  @IsOptional()
  @IsBoolean()
  is_two_factor_authentication_enabled: Boolean;

  @Prop({ default: now(), select: false })
  @IsOptional()
  created_at: Date;

  @Prop({ default: now(), select: false })
  @IsOptional()
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.method('isAdmin', function (this: User): boolean {
  return !!this?.role && this.role === RolesEnum.ADMIN;
});
