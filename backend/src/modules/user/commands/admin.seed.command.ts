import { Injectable, Logger } from '@nestjs/common';
import { Command } from '../../command';
import { faker } from '@faker-js/faker';
import { Model, now } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../schemas/user.schema';
import { RolesEnum } from '../enums';

@Injectable()
export class AdminSeedCommand {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly logger: Logger,
  ) {}

  @Command({ command: 'admin:seed', describe: 'Seed user collection' })
  public async run(): Promise<void> {
    this.logger.log({ message: `Admin seeding started` });
    await this.userModel.create([
      {
        name: 'John Doe',
        email: 'admin@gmail.com',
        phone: '0011034673',
        password:
          '$2b$10$a0g4BDaC/WPUWqGpg4PpveJY52wcdq9AyilBVfnkXijfCddczqDBK',
        email_verified: now(),
        image: {
          key: faker.hacker.verb(),
          value:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        status: 'Active',
        role: RolesEnum.ADMIN,
        is_two_factor_authentication_enabled: false,
      },
      {
        name: 'Mike Smith',
        email: 'mike@gmail.com',
        phone: '0034034688',
        password:
          '$2b$10$a0g4BDaC/WPUWqGpg4PpveJY52wcdq9AyilBVfnkXijfCddczqDBK',
        email_verified: now(),
        image: {
          key: faker.hacker.verb(),
          value:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        status: 'Active',
        role: RolesEnum.ADMIN,
        is_two_factor_authentication_enabled: false,
      },
    ]);
    this.logger.log({ message: `Admin seeding completed` });
  }
}
