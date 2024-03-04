import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class AuthService {
  constructor(
    @InjectQueue('verification-email') private verificationEmailQueue: Queue,
  ) {}

  public signIn = () => {};

  public forgotPassword(email: string) {}

  public resetPassword(token: string, password: string) {}

  public async sendVerificationMail(payload) {
    await this.verificationEmailQueue.add('send-verification-email', payload, {
      attempts: 3,
    });
  }
}
