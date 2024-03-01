import { EmailService } from '../../util/services/email.service';
import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';

@Processor('verification-email')
export class VerificationMailQueue {
  constructor(private readonly mailService: EmailService) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}: ${job.data.id}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`Job ${job.id} of type ${job.name} completed`);
  }

  @Process('send-verification-email')
  async send(job: Job<any>) {
    try {
      console.log('send mail trigered', job);
      const {email, token} =  job.data;
      await this.mailService.sendVerificationEmail(email, token);
    } catch (error) {
      console.log(`Failed to send email | error: ${error.message}`);
    }
  }
}