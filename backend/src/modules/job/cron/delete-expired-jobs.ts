import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Cron , CronExpression} from '@nestjs/schedule';

import { DeleteExpiredJobsFeature } from '../features';

@Injectable()
export class DeleteExpiredJobsCron {
  constructor(
    private readonly logger: Logger,
    private readonly deleteExpiredJobsFeature: DeleteExpiredJobsFeature,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  private async deleteExpiredJobs(): Promise<void> {
    this.logger.log(
      'DeleteExpiredJobsCron Started',
      moment().format('h:mm:ss a'),
    );
    await this.deleteExpiredJobsFeature.handle();
    this.logger.log(
      'DeleteExpiredJobsCron Ended',
      moment().format('h:mm:ss a'),
    );
  }
}
