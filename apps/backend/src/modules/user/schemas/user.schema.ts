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
import * as bcrypt from 'bcrypt';

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

  @Prop({
    type: { _id: false, key: { type: String }, value: { type: String } },
    default: null,
  })
  @IsObject()
  @IsOptional()
  resume?: {
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
  is_two_factor_authentication_enabled: boolean;

  @Prop({ default: null })
  @IsOptional()
  @IsString()
  about?: string;

  @Prop({ default: null })
  @IsOptional()
  @IsString()
  country?: string;

  @Prop({ default: null })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @Prop({ default: null })
  @IsOptional()
  @IsString()
  city?: string;

  @Prop({ default: null })
  @IsOptional()
  @IsString()
  state?: string;

  @Prop({ default: null })
  @IsOptional()
  @IsString()
  zip?: string;

  @Prop({ default: false })
  @IsOptional()
  @IsBoolean()
  comments?: boolean;

  @Prop({ default: false })
  @IsOptional()
  @IsBoolean()
  candidates?: boolean;

  @Prop({ default: false })
  @IsOptional()
  @IsBoolean()
  offers?: boolean;

  @Prop({ default: 'email', enum: ['everything', 'email', 'nothing'] })
  @IsOptional()
  @IsString()
  pushNotifications?: string;

  @Prop({ default: now(), select: false })
  @IsOptional()
  created_at: Date;

  @Prop({ default: now(), select: false })
  @IsOptional()
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', function (next: (err?: Error) => void) {
  if (this.password) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.method('isAdmin', function (this: User): boolean {
  return !!this?.role && this.role === RolesEnum.ADMIN;
});
