import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';

import { EmailService } from '../../app/services';
import { Logger } from '@nestjs/common';

@Processor('reset-password-email')
export class PasswordResetMailQueue {
  private readonly logger = new Logger(PasswordResetMailQueue.name);

  constructor(private readonly mailService: EmailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}: ${job.data.id}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Job ${job.id} of type ${job.name} completed`);
  }

  @Process('send-reset-password-email')
  async send(job: Job<any>) {
    try {
      console.log('send mail trigered', job);
      const { token, email } = job.data;
      await this.mailService.sendPasswordResetEmail(email, token);
    } catch (error) {
      console.log(`Failed to send email | error: ${error.message}`);
    }
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.log(` ${job.id} : ${JSON.stringify(err.message)}`);
  }
}
