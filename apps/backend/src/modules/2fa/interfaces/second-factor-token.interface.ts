import { Document } from 'mongoose';

export interface SecondFactorTokenInterface extends Document {
  userId: string;
  code: number;
  active: boolean;
}
