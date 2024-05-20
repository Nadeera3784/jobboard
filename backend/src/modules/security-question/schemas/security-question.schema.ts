import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({
  versionKey: false,
})
export class SecurityQuestion extends Document {
  @Prop()
  @IsString()
  @IsNotEmpty()
  answer: string;

  @Prop()
  @IsNotEmpty()
  @IsString()
  question: string;

  @Prop({ type: SchemaTypes.ObjectId })
  @IsNotEmpty()
  userId: Types.ObjectId;
}

export const SecurityQuestionSchema =
  SchemaFactory.createForClass(SecurityQuestion);
