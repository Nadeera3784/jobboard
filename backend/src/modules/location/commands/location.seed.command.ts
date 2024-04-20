import { Injectable, Logger } from '@nestjs/common';
import { Command } from '../../command';
import { faker } from '@faker-js/faker';
import { Location } from '../schemas/location.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LocationSeedCommand {
  constructor(
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
    private readonly logger: Logger,
  ) {}

  @Command({ command: 'location:seed', describe: 'Seed location collection' })
  public async run(): Promise<void> {
    this.logger.log({ message: `Location seeding started` });

    for (let index = 0; index < 20; index++) {
      await this.locationModel.create({
        name: faker.location.city(),
        status: 'Active',
      });
    }

    this.logger.log({ message: `Location seeding completed` });
  }
}
