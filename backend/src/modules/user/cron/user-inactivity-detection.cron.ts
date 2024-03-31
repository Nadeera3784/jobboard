import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Cron } from '@nestjs/schedule';

import { DetectInactiveUsersFeature } from '../features';

@Injectable()
export class UserInactivityDetectionCron {
  constructor(
    private readonly logger: Logger,
    private readonly detectInactiveUsersFeature: DetectInactiveUsersFeature,
  ) {
  }
  //TODO: check database for inactive users
  @Cron('45 * * * * *')
  private async detectInactiveUsers(): Promise<void> {
    this.logger.log('UserInactivityIdentifierCron Started', moment().format('h:mm:ss a'));
    await this.detectInactiveUsersFeature.handle();
    this.logger.log('UserInactivityIdentifierCron Ended', moment().format('h:mm:ss a'));
  }
}
