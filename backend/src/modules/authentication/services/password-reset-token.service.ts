import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { PasswordResetToken } from '../schemas/passwordResetToken.schema';

@Injectable()
export class PasswordResetTokenService {
  constructor(
    @InjectModel(PasswordResetToken.name)
    private readonly passwordResetTokenModel: Model<PasswordResetToken>,
  ) {}

  async getByEmail(email: string) {
    return await this.passwordResetTokenModel.findOne({
      email: email,
    });
  }

  async getByToken(token: string) {
    return await this.passwordResetTokenModel.findOne({
      token: token,
    });
  }

  async delete(id: string) {
    return await this.passwordResetTokenModel.findByIdAndDelete(id);
  }

  async create(email: string, token: string, expires: any) {
    return await this.passwordResetTokenModel.create({
      email: email,
      token: token,
      expires: expires,
    });
  }

  async generatePasswordResetToken(email: string) {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.getByEmail(email);

    if (existingToken) {
      await this.delete(existingToken._id);
    }

    return this.create(email, token, expires);
  }
}
