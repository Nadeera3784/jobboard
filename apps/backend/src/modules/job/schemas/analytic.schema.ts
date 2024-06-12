import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Document, SchemaTypes, now } from 'mongoose';
import { Job } from './job.schema';

@Schema({
  versionKey: false,
})
export class Analytic extends Document {
  @Prop({ default: 0 })
  @IsNumber()
  @IsOptional()
  view_count: number;

  @Prop({ default: 0 })
  @IsNumber()
  @IsOptional()
  application_count: number;

  @Prop({ type: SchemaTypes.ObjectId, ref: Job.name })
  @IsNotEmpty()
  job: Job;

  @Prop({ default: now(), select: false })
  @IsOptional()
  created_at: Date;
}

export const AnalyticSchema = SchemaFactory.createForClass(Analytic);
