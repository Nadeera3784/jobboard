import { Injectable, Logger } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Location } from '../schemas/location.schema';
import { Command } from '../../core/command';

@Injectable()
export class LocationSeedCommand {
  constructor(
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
  ) {}

  @Command({ command: 'location:seed', describe: 'Seed location collection' })
  public async run(): Promise<void> {
    Logger.log({ message: `Location seeding started` });

    for (let index = 0; index < 20; index++) {
      await this.locationModel.create({
        name: faker.location.city(),
        status: 'Active',
      });
    }

    Logger.log({ message: `Location seeding completed` });
  }
}
