import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserInactivityDetectionCron {
  constructor(
    private readonly logger: Logger,
  ) {
  }

  @Cron('45 * * * * *')
  private async identifyInactiveUsers(): Promise<void> {
    this.logger.log('UserInactivityIdentifierCron Started', moment().format('h:mm:ss a'));
    this.logger.log('UserInactivityIdentifierCron Ended', moment().format('h:mm:ss a'));
  }
}
