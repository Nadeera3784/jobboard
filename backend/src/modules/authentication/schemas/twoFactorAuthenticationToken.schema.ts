import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({
  versionKey: false,
})
export class twoFactorAuthenticationToken extends Document {
  @Prop({ type: SchemaTypes.ObjectId, unique: true })
  @IsNotEmpty()
  user: Types.ObjectId;

  @Prop({ unique: true })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export const TwoFactorAuthenticationTokenSchema = SchemaFactory.createForClass(
  twoFactorAuthenticationToken,
);
