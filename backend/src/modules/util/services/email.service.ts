import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  private readonly resend;

  private readonly appUrl: string;

  private readonly mailFrom: string;

  constructor(
    private configService: ConfigService,
    @InjectQueue('verification-email') private verificationEmailQueue: Queue,
  ) {
    this.resend = new Resend(configService.get('mail.resend.key'));
    this.appUrl = configService.get('app.app_url');
    this.mailFrom = configService.get('mail.resend.from');
  }

  public async sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${this.appUrl}/auth/new-verification?token=${token}`;
    await this.resend.emails.send({
      from: this.mailFrom,
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${this.appUrl}/auth/new-password?token=${token}`;

    await this.resend.emails.send({
      from: this.mailFrom,
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
  }
}
