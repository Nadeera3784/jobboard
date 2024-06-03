import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly resend: Resend;

  constructor(private configService: ConfigService) {
    this.resend = new Resend(configService.get('mail.resend.key'));
  }

  public async sendVerificationEmail(email: string, token: string) {
    const confirmLink = `${this.configService.get(
      'app.api_url',
    )}/auth/new-verification?token=${token}`;
    await this.resend.emails.send({
      from: this.configService.get('mail.resend.from'),
      to: email,
      subject: 'Confirm your email',
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
    });
  }

  public async sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${this.configService.get(
      'app.api_url',
    )}/auth/new-password?token=${token}`;

    await this.resend.emails.send({
      from: this.configService.get('mail.resend.from'),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
    });
  }

  public async sendAccountInactivityReminderEmail(email: string) {
    await this.resend.emails.send({
      from: this.configService.get('mail.resend.from'),
      to: email,
      subject: 'Urgent Action Required: Login to Your Account',
      html: `<p>It appears that there has been no recent activity in your account. As part of our commitment to  ensuring the security and functionality of your account, we urge you to log in as soon as possible.</p>`,
    });
  }
}
