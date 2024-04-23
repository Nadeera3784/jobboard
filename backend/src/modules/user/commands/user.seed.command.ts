import { Injectable, Logger } from '@nestjs/common';
import { Command } from '../../command';
import { faker } from '@faker-js/faker';
import { Model, now } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../schemas/user.schema';

@Injectable()
export class UserSeedCommand {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly logger: Logger,
  ) {}

  @Command({ command: 'user:seed', describe: 'Seed user collection' })
  public async run(): Promise<void> {
    this.logger.log({ message: `User seeding started` });
    for (let index = 0; index < 20; index++) {
      await this.userModel.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        password:
          '$2b$10$a0g4BDaC/WPUWqGpg4PpveJY52wcdq9AyilBVfnkXijfCddczqDBK',
        email_verified: now(),
        status: 'Active',
      });
    }
    this.logger.log({ message: `User seeding completed` });
  }
}
