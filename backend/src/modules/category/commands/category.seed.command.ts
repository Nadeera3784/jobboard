import { Injectable, Logger } from '@nestjs/common';
import { Command } from '../../core/command';
import { faker } from '@faker-js/faker';
import { Category } from '../schemas/category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategorySeedCommand {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  @Command({ command: 'category:seed', describe: 'Seed category collection' })
  public async run(): Promise<void> {
    Logger.log({ message: `Category seeding started` });

    for (let index = 0; index < 20; index++) {
      await this.categoryModel.create({
        name: faker.person.firstName(),
        status: 'Active',
      });
    }

    Logger.log({ message: `Category seeding completed` });
  }
}
