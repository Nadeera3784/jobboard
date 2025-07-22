import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Model } from 'mongoose';

import { User } from '../../../modules/user/schemas';
import { SecondFactor } from '../schemas';
import { CodeNumberGeneratorService } from '../services';
import { SecondFactorTokenInterface } from '../interfaces';
import { RequestFingerprint } from '../../app/interfaces/request-fingerprint.interface';
import { RequestParser } from '../../app/services/request-parser.service';

@Injectable()
export class SecondFactorService {
  constructor(
    private readonly codeGenerator: CodeNumberGeneratorService,
    @InjectModel(SecondFactor.name)
    private readonly secondFactorTokenModel: Model<SecondFactor>,
    @InjectQueue('second-factor-verification-email')
    private secondFactorVerificationCodeEmailQueue: Queue,
  ) {}

  public async generate(user: User): Promise<void> {
    const code: number = await this.codeGenerator.generate(user._id as string);
    await Promise.all([
      this.secondFactorTokenModel.updateMany(
        { userId: user._id, code: { $ne: code }, active: true },
        { active: false },
      ),
      this.secondFactorTokenModel.create({
        code,
        userId: user._id,
      } as SecondFactorTokenInterface),
    ]);

    // Send the verification code via email
    await this.sendSecondFactorVerificationCodeEmail({
      code,
      email: user.email,
      user,
    });
  }

  public async resend(user: User): Promise<void> {
    // Find the most recent active code for the user
    const activeCode = await this.secondFactorTokenModel
      .findOne({
        userId: user._id,
        active: true,
      })
      .sort({ created_at: -1 })
      .exec();

    if (!activeCode) {
      // If no active code exists, generate a new one
      await this.generate(user);
    } else {
      // Resend the existing code
      await this.sendSecondFactorVerificationCodeEmail({
        code: activeCode.code,
        email: user.email,
        user,
      });
    }
  }

  public async sendSecondFactorVerificationCodeEmail(
    payload: any,
  ): Promise<void> {
    await this.secondFactorVerificationCodeEmailQueue.add(
      'send-second-factor-verification-email',
      payload,
      {
        attempts: 3,
      },
    );
  }

  public async validate(
    userId: string,
    code: number,
    request: Request,
  ): Promise<boolean> {
    const codeEntity: SecondFactorTokenInterface =
      await this.secondFactorTokenModel
        .findOne({
          active: true,
          code,
          userId: userId,
        })
        .exec();

    if (!codeEntity) {
      throw new UnauthorizedException(
        'Code is invalid, please generate a new one.',
      );
    }

    // Deactivate the code after successful validation
    codeEntity.active = false;
    await codeEntity.save();

    return true;
  }

  public async getActiveCodeForUser(
    userId: string,
  ): Promise<SecondFactorTokenInterface | null> {
    return await this.secondFactorTokenModel
      .findOne({
        userId,
        active: true,
      })
      .sort({ created_at: -1 })
      .exec();
  }

  public async deactivateUserCodes(userId: string): Promise<void> {
    await this.secondFactorTokenModel.updateMany(
      { userId, active: true },
      { active: false },
    );
  }
}
