import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { Document, now } from 'mongoose';

@Schema({
  versionKey: false,
})
export class VerificationToken extends Document {

  @Prop({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ unique: true })
  @IsNotEmpty()
  token: string;

  @Prop()
  @IsNotEmpty()
  expires: Date;
}

export const VerificationTokenSchema = SchemaFactory.createForClass(VerificationToken);