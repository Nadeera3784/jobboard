import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { Feature } from '../../app/features/feature';
import { UserService } from '../services/user.service';
import { UserInterface } from '../interfaces';

@Injectable()
export class DetectInactiveUsersFeature extends Feature {
  constructor(
    private readonly userService: UserService,
    @InjectQueue('inactivity-reminder-email')
    private inactivityReminderQueue: Queue,
  ) {
    super();
  }

  public async handle() {
    const users = await this.userService.getInactivityUsers();
    users.eachAsync(async (user: UserInterface) => {
      await this.inactivityReminderQueue.add('send-reminder-email', user, {
        attempts: 3,
      });
    });
  }
}
