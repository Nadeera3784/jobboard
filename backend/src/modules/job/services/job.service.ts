import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';

import { Job } from '../schemas/job.schema';
import { CreateJobDto, UpdateJobDto } from '../dtos';
import { JobStatus } from '../enums';
import {
  JobFilterInterface,
  JobOrderInterface,
  JobSearchInterface,
  JobInterface,
} from '../interfaces';
import { parseJson, transformToObjectId } from '../../app/services';

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
      { $match: { status: JobStatus.ACTIVE } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },
      {
        $lookup: {
          from: 'locations',
          localField: 'location',
          foreignField: '_id',
          as: 'locationInfo',
        },
      },
      { $unwind: '$locationInfo' },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
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
          category_name: '$categoryInfo.name',
          location_name: '$locationInfo.name',
          company_name: '$userInfo.name',
          company_logo: '$userInfo.image',
        },
      },
    ];
    const match: any = { $match: {} };
    if (search) {
      const parsedSearch: JobSearchInterface =
        parseJson<JobSearchInterface>(search);
      match.$match.$or = [
        { name: parsedSearch },
        { description: parsedSearch },
      ];
    }
    if (filter) {
      const parsedFilter: JobFilterInterface =
        parseJson<JobFilterInterface>(filter);
      const filters = transformToObjectId(parsedFilter, [
        'category',
        'location',
      ]);
      match.$match = { ...match.$match, ...filters };
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
            status: JobStatus.EXPIRED,
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
}
