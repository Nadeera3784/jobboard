import { Injectable, Logger } from '@nestjs/common';
import { Command } from '../../core/command';
import { faker } from '@faker-js/faker';
import { Model, now } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../schemas/user.schema';

@Injectable()
export class UserSeedCommand {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Command({ command: 'user:seed', describe: 'Seed user collection' })
  public async run(): Promise<void> {
    Logger.log({ message: `User seeding started` });
    for (let index = 0; index < 20; index++) {
      await this.userModel.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password: 'password',
        email_verified: now(),
        image: {
          key: faker.hacker.verb(),
          value:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        status: 'Active',
        is_two_factor_authentication_enabled: false,
      });
    }
    Logger.log({ message: `User seeding completed` });
  }
}
