import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Cron, CronExpression } from '@nestjs/schedule';

import { UpdateExpireJobsFeature } from '../features';

@Injectable()
export class UpdateExpireJobsCron {
  constructor(
    private readonly logger: Logger,
    private readonly updateExpireJobsFeature: UpdateExpireJobsFeature,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async updateActiveJobs(): Promise<void> {
    this.logger.log(
      'UpdateExpireJobsCron Started',
      moment().format('h:mm:ss a'),
    );
    await this.updateExpireJobsFeature.handle();
    this.logger.log('UpdateExpireJobsCron Ended', moment().format('h:mm:ss a'));
  }
}
