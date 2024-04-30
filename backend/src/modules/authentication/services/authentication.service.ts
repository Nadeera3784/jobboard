import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectQueue('verification-email') private verificationEmailQueue: Queue,
    @InjectQueue('reset-password-email') private resetPasswordEmailQueue: Queue,
  ) {}

  public async signIn(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }

  public async sendResetPasswordMail(payload) {
    await this.resetPasswordEmailQueue.add(
      'send-reset-password-email',
      payload,
      {
        attempts: 3,
      },
    );
  }

  public async sendVerificationMail(payload) {
    await this.verificationEmailQueue.add('send-verification-email', payload, {
      attempts: 3,
    });
  }
}
