import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { faker } from '@faker-js/faker';

import { Command } from '../../command';
import { Job } from '../schemas/job.schema';
import { User } from '../../user/schemas/user.schema';
import { Category } from '../../category/schemas/category.schema';
import { Location } from '../../location/schemas/location.schema';
import {
  ArrayElementToString,
  getRandomEntity,
} from '../../app/services/helper.service';

@Injectable()
export class JobSeedCommand {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Location.name) private readonly locationModel: Model<Location>,
    private readonly logger: Logger,
  ) {}

  @Command({ command: 'job:seed', describe: 'Seed job collection' })
  public async run(): Promise<void> {
    this.logger.log({ message: `Job seeding started` });

    const error = {
      status: false,
      message: '',
    };

    for (let index = 0; index < 15; index++) {
      const remote = getRandomEntity(['Remote', 'On-site', 'Hybrid']);

      const jobType = getRandomEntity([
        'Full-time',
        'Part-time',
        'Contract',
        'Internship',
        'Temporary',
      ]);
      const experienceLevel = getRandomEntity([
        'Internship',
        'Associate',
        'Director',
        'Entry level',
        'Mid-Senior level',
        'Executive',
      ]);

      const users = await this.userModel.find({}).select('_id').limit(4);
      if (users.length === 0) {
        error.status = true;
        error.message = 'Users seeder needs be ran before run this command';
        break;
      }
      const userId = getRandomEntity(ArrayElementToString(users, '_id'));

      const categories = await this.categoryModel
        .find({})
        .select('_id')
        .limit(4);
      if (categories.length === 0) {
        error.status = true;
        error.message = 'Category seeder needs be ran before run this command';
        break;
      }
      const categoryId = getRandomEntity(
        ArrayElementToString(categories, '_id'),
      );

      const locations = await this.locationModel
        .find({})
        .select('_id')
        .limit(4);
      if (locations.length === 0) {
        error.status = true;
        error.message = 'Location seeder needs be ran before run this command';
        break;
      }
      const locationId = getRandomEntity(
        ArrayElementToString(locations, '_id'),
      );

      await this.jobModel.create({
        name: faker.person.jobTitle(),
        description: faker.lorem.paragraphs(10, '<br/>\n'),
        category: categoryId,
        location: locationId,
        user: userId,
        remote: remote,
        job_type: jobType,
        experience_level: experienceLevel,
        status: 'Active',
      });
    }

    if (error.status) {
      this.logger.error({ message: error.message });
    }

    this.logger.log({ message: `Job seeding completed` });
  }
}
