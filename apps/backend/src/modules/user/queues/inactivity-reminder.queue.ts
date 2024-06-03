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

@Processor('inactivity-reminder-email')
export class InactivityReminderQueue {
  private readonly logger = new Logger(InactivityReminderQueue.name);

  constructor(private readonly mailService: EmailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} of type ${job.name} completed`);
  }

  @Process('send-reminder-email')
  async send(job: Job<any>) {
    try {
      this.logger.log('mail sent started', job.name);
      await this.mailService.sendAccountInactivityReminderEmail(job.data.email);
      this.logger.log('mail sent', job.name);
    } catch (error) {
      this.logger.log(`Failed to send email | error: ${error.message}`);
    }
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    this.logger.log(` ${job.id} : ${JSON.stringify(err.message)}`);
  }
}
