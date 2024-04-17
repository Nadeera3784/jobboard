import { Injectable } from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';

import { Job } from '../schemas/job.schema';
import { CreateJobDto, UpdateJobDto } from '../dtos';
import { Status } from '../enums';
import {
  JobFilterInterface,
  JobOrderInterface,
  JobSearchInterface,
  JobInterface,
} from '../interfaces';
import { parseJson, getRandomEntity, transformToObjectId} from '../../app/services/helper.service';
import { faker } from '@faker-js/faker';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>) {}

  public async getAll(
    filter: JobFilterInterface,
    search: JobSearchInterface,
    order: JobOrderInterface,
    limit: number,
    page: number,
  ): Promise<{ data: JobInterface[]; count: number }> {
    const query: any[] = [
      { $match: { status: 'Active' } },
      {
        $lookup : {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
        }
      },
      {   $unwind:"$categoryInfo" },
      {
        $lookup : {
            from: "locations",
            localField: "location",
            foreignField: "_id",
            as: "locationInfo",
        }
      },
      {   $unwind:"$locationInfo" },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          category: 1,
          location: 1,
          user: 1,
          remote: 1,
          job_type: 1,
          experience_level: 1,
          category_name : "$categoryInfo.name",
          location_name : "$locationInfo.name",
        },
      }
    ];
    const match: any = { $match: {} };
    if (search) {
      const parsedSearch: JobSearchInterface = parseJson<JobSearchInterface>(search);
      match.$match.$or = [
        { name: parsedSearch }, 
        { description: parsedSearch }
      ];
    }
    if (filter) {
      const parsedFilter: JobFilterInterface = parseJson<JobFilterInterface>(filter);
      const filters = transformToObjectId(parsedFilter, ["category", "location"]);
      match.$match = { ...match.$match, ...filters};
    }    
    query.push(match);
    const countQuery: any = [...query];
    countQuery.push({ $count: 'count' });
    const parsedOrder: JobOrderInterface = parseJson<JobOrderInterface>(order);
    query.push({ $sort: parsedOrder });
    query.push({ $skip: limit * (page - 1) });
    query.push({ $limit: limit });
    const [count = { count: 0 }]: any = await Promise.resolve(
      this.jobModel.aggregate(countQuery),
    );
    return Promise.resolve({
      data: await Promise.resolve(this.jobModel.aggregate(query)),
      count: count.count,
    });
  }

  public async getById(id: string) {
    return await this.jobModel.findById(id);
  }

  public async create(createJobDto: CreateJobDto) {
    return await this.jobModel.create(createJobDto);
  }

  public async update(id: string, updateJobDto: UpdateJobDto) {
    return await this.jobModel.findByIdAndUpdate({ _id: id }, updateJobDto);
  }

  public async delete(id: string) {
    return await this.jobModel.deleteOne({
      _id: id,
    });
  }

  public async getExpiredJobs(duration = 1, batchSize = 50) {
    return await this.jobModel
      .aggregate([
        {
          $match: {
            status: Status.EXPIRED,
          },
        },
        {
          $addFields: {
            hasWithinDuration: {
              $cond: {
                if: { $eq: [{ $type: '$created_at' }, 'date'] },
                then: {
                  $lt: [
                    '$created_at',
                    moment().subtract(duration, 'months').toDate(),
                  ],
                },
                else: true,
              },
            },
          },
        },
        {
          $match: {
            hasWithinDuration: true,
          },
        },
      ])
      .cursor({
        batchSize: batchSize,
      });
  }

  async seeds() {
    for (let index = 0; index < 15; index++) {
      const category = getRandomEntity(['66066a2f09e9b6a12a7d07f2', '66066a2f09e9b6a12a7d07f4', '66066a2f09e9b6a12a7d07f6', '66066a2f09e9b6a12a7d07f8']);
      const location = getRandomEntity(['660c3039099633de196aa183', '66102887e9443bf3363a27b8', '66102887e9443bf3363a27ba', '66102887e9443bf3363a27bc']);
      const remote = getRandomEntity(['Remote', 'On-site', 'Hybrid']);
      const jobType = getRandomEntity(['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary']);
      const experienceLevel = getRandomEntity(['Internship', 'Associate', 'Director', 'Entry level', 'Mid-Senior level', 'Executive']);
      await this.jobModel.create({
        name: faker.internet.displayName(),
        description: faker.word.words(),
        category: category,
        location: location,
        user: '66082529899034a393c5a963',
        remote: remote,
        job_type: jobType,
        experience_level: experienceLevel,
        status: 'Active',
      });
    }
  }
}
