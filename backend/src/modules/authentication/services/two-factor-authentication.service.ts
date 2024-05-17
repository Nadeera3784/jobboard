import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

import { twoFactorAuthenticationToken } from '../schemas';
import { User } from '../../user/schemas/user.schema';

@Injectable()
export class TwoFactorAuthenticationTokenService {
  constructor(
    private configService: ConfigService,
    @InjectModel(twoFactorAuthenticationToken.name)
    private readonly twoFactorAuthenticationTokenModel: Model<twoFactorAuthenticationToken>,
  ) {}

  async generateTwoFactorAuthenticationSecret(user: User) {
    const token = authenticator.generateSecret();
    await this.twoFactorAuthenticationTokenModel.updateOne(
      { user: user._id },
      { token: token },
      { new: true, upsert: true },
    );
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('app.app_name'),
      token,
    );
    return {
      token,
      otpAuthUrl,
    };
  }

  async validateTwoFactorAuthenticationToken(userId: string, token: string) {
    const model = await this.twoFactorAuthenticationTokenModel.findOne({
      user: userId,
    });
    if (model) {
      return authenticator.verify({
        token: token,
        secret: model.token,
      });
    }
    return false;
  }

  async generateQrCodeDataURL(url: string) {
    return toDataURL(url);
  }

  async generateTwoFactorAuthenticationToken(userId: string) {
    const model = await this.twoFactorAuthenticationTokenModel.findOne({
      user: userId,
    });
    if (model) {
      return authenticator.generate(model.token);
    }
    return null;
  }
}
