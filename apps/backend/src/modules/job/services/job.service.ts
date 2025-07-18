import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { ConfigService } from '@nestjs/config';

import { Job } from '../schemas/job.schema';
import { CreateJobDto, UpdateJobDto } from '../dtos';
import { JobStatus } from '../enums';
import {
  JobFilterInterface,
  JobOrderInterface,
  JobSearchInterface,
  JobInterface,
} from '../interfaces';
import { UtilityService } from '../../app/services';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    private configService: ConfigService,
  ) {}

  async getAll(
    order,
    columns,
    filters,
    search: string,
    limit: number,
    start: number,
    userId?: string,
  ) {
    try {
      let searchQuery: any = {};
      let sort: any = { created_at: -1 };
      let recordsTotal = 0;
      let recordsFiltered = 0;
      const whereQuery: any = {};

      // Filter by user ID if provided (for company users)
      if (userId) {
        whereQuery.user = userId;
      }

      if (filters.status) {
        whereQuery.status = filters.status;
      }

      if (filters.role) {
        whereQuery.role = filters.role;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        searchQuery = {
          $or: [{ name: regex }, { description: regex }],
        };
      }

      searchQuery = { ...searchQuery, ...whereQuery };

      if (order.length && columns.length) {
        const sortByOrder: any = order.reduce((memo: any, ordr: any) => {
          memo[ordr.name] = ordr.dir === 'asc' ? 1 : -1;
          return memo;
        }, {});

        if (Object.keys(sortByOrder).length) {
          sort = sortByOrder;
        }
      }

      // Update count queries to respect user filter
      const countQuery = userId ? { user: userId } : {};
      recordsTotal = await this.jobModel.countDocuments(countQuery);
      recordsFiltered = await this.jobModel.countDocuments(searchQuery);

      let results = await this.jobModel
        .find(searchQuery)
        .select(
          '_id name remote job_type experience_level status created_at expired_at',
        )
        .skip(Number(start))
        .limit(Number(limit))
        .sort(sort)
        .exec();
      results = results.map((result: any) => {
        return {
          ...result.toObject(),
          actions: [
            {
              id: 1,
              label: 'Edit',
              type: 'link',
              endpoint: `/company/jobs/${result._id}`,
            },
            {
              id: 2,
              label: 'Applications',
              type: 'link',
              endpoint: `/company/jobs/${result._id}/applications`,
            },
            {
              id: 3,
              label: 'Delete',
              type: 'delete',
              endpoint: `${this.configService.get('app.api_url')}/jobs/${
                result._id
              }`,
              confirm_message: 'Are you sure want to delete?',
            },
          ],
        };
      });

      return {
        recordsFiltered: recordsFiltered,
        recordsTotal: recordsTotal,
        data: results,
      };
    } catch (error) {
      return error;
    }
  }

  public async getSearch(
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
        UtilityService.parseJson<JobSearchInterface>(search);
      match.$match.$or = [
        { name: parsedSearch },
        { description: parsedSearch },
      ];
    }
    if (filter) {
      const jsonFilter: JobFilterInterface =
        UtilityService.parseJson<JobFilterInterface>(filter);
      const parsedFilter = UtilityService.processSearchFilter(jsonFilter);
      if (parsedFilter.category) {
        match.$match['category'] = new Types.ObjectId(
          parsedFilter.category._id,
        );
      }
      if (parsedFilter.location) {
        match.$match['location'] = new Types.ObjectId(
          parsedFilter.location._id,
        );
      }
      if (parsedFilter.remote) {
        match.$match['remote'] = parsedFilter.remote._id;
      }
      if (parsedFilter.job_type) {
        match.$match['job_type'] = parsedFilter.job_type._id;
      }
      if (parsedFilter.experience_level) {
        match.$match['experience_level'] = parsedFilter.experience_level._id;
      }
    }
    query.push(match);
    const countQuery: any = [...query];
    countQuery.push({ $count: 'count' });
    const parsedOrder: JobOrderInterface =
      UtilityService.parseJson<JobOrderInterface>(order);
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

  public async updateStatus(id: string, status: JobStatus) {
    return await this.jobModel.findByIdAndUpdate(
      { _id: id },
      { status: status },
    );
  }

  public async delete(id: string) {
    return await this.jobModel.deleteOne({
      _id: id,
    });
  }

  public async getActiveExpireJobs(batchSize = 50) {
    return await this.jobModel
      .aggregate([
        {
          $match: {
            status: JobStatus.ACTIVE,
            expired_at: { $lt: moment().toDate() },
          },
        },
      ])
      .cursor({ batchSize: batchSize });
  }

  public async getExpiredJobs(duration = 2, batchSize = 50) {
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
