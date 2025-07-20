import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document, ObjectId } from 'mongoose';

@Schema({
  versionKey: false,
})
export class PasswordResetToken extends Document {
  _id: ObjectId;

  @Prop({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ unique: true })
  @IsNotEmpty()
  @IsString()
  token: string;

  @Prop()
  @IsNotEmpty()
  expires: Date;
}

export const PasswordResetTokenSchema =
  SchemaFactory.createForClass(PasswordResetToken);
