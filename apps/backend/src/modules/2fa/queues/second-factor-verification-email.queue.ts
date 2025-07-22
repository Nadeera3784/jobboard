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

@Processor('second-factor-verification-email')
export class SecondFactorVerificationMailQueue {
  private readonly logger = new Logger(SecondFactorVerificationMailQueue.name);

  constructor(private readonly mailService: EmailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} of type ${job.name} completed`);
  }

  @Process('send-second-factor-verification-email')
  async send(job: Job<any>) {
    try {
      this.logger.log('Mail sending started', job.name);
      const { code, email } = job.data;
      await this.mailService.sendSecondFactorCodeEmail(email, code);
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
