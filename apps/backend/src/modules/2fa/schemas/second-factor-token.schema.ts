import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';

@Schema({
  versionKey: false,
})
export class SecondFactor extends Document {
  @Prop({ type: SchemaTypes.Boolean, default: true })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;

  @Prop({ type: SchemaTypes.Number })
  @IsNotEmpty()
  code: number;

  @Prop({ type: SchemaTypes.String })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @Prop({ default: Date.now, expires: 600 })
  @IsOptional()
  created_at: Date;
}

export const SecondFactorTokenSchema =
  SchemaFactory.createForClass(SecondFactor);

SecondFactorTokenSchema.index({ userId: 1 });
