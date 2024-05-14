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

@Processor('verification-email')
export class VerificationMailQueue {
  private readonly logger = new Logger(VerificationMailQueue.name);

  constructor(private readonly mailService: EmailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} of type ${job.name} completed`);
  }

  @Process('send-verification-email')
  async send(job: Job<any>) {
    try {
      this.logger.log('Mail sending started', job.name);
      const { token, email } = job.data;
      await this.mailService.sendVerificationEmail(email, token);
      this.logger.log('Mail sending sent', email);
    } catch (error) {
      this.logger.log(`Failed to send email | error: ${error.message}`);
    }
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.log(` ${job.id} : ${JSON.stringify(err.message)}`);
  }
}
