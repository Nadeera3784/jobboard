import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Application } from '../schemas/application.shema';
import { CreateApplicationDto, UpdateApplicationDto } from '../dtos';
import { ApplicationStatusEnum } from '../enums';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,
  ) {}

  public async getAll() {
    return await this.applicationModel.find({});
  }

  public async getById(id: string) {
    return await this.applicationModel.findById(id);
  }

  public async create(createApplicationDto: CreateApplicationDto, id: string) {
    return await this.applicationModel.create({
      user: createApplicationDto.user,
      job: id,
    });
  }

  public async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    return await this.applicationModel.findByIdAndUpdate(
      { _id: id },
      updateApplicationDto,
    );
  }

  public async delete(id: string) {
    return await this.applicationModel.deleteOne({
      _id: id,
    });
  }

  public async isApplied(jobId: string, userId: string): Promise<boolean> {
    const application = await this.applicationModel.findOne({
      job: jobId,
      user: userId,
    });
    return !!application;
  }

  async datatable(
    userId: string,
    order,
    columns,
    filters,
    search: string,
    limit: number,
    start: number,
  ) {
    try {
      let searchQuery: any = { user: userId };
      let sort: any = { created_at: -1 };
      let recordsTotal = 0;
      let recordsFiltered = 0;
      const whereQuery: any = { user: userId };

      if (filters.status) {
        whereQuery.status = filters.status;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        searchQuery = {
          ...whereQuery,
          $or: [{ status: regex }],
        };
      } else {
        searchQuery = whereQuery;
      }

      if (order.length && columns.length) {
        const sortByOrder: any = order.reduce((memo: any, ordr: any) => {
          memo[ordr.name] = ordr.dir === 'asc' ? 1 : -1;
          return memo;
        }, {});

        if (Object.keys(sortByOrder).length) {
          sort = sortByOrder;
        }
      }

      recordsTotal = await this.applicationModel.countDocuments({
        user: userId,
      });
      recordsFiltered = await this.applicationModel.countDocuments(searchQuery);

      let results = await this.applicationModel
        .find(searchQuery)
        .populate('job', 'name')
        .select('_id job status created_at')
        .skip(Number(start))
        .limit(Number(limit))
        .sort(sort)
        .exec();

      results = results.map((result: any) => {
        return {
          ...result.toObject(),
          job_name: result.job?.name || 'Unknown Job',
          actions: [],
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

  async jobApplicationsDataTable(
    jobId: string,
    order,
    columns,
    filters,
    search: string,
    limit: number,
    start: number,
  ) {
    try {
      let searchQuery: any = { job: jobId };
      let sort: any = { created_at: -1 };
      let recordsTotal = 0;
      let recordsFiltered = 0;
      const whereQuery: any = { job: jobId };

      if (filters.status) {
        whereQuery.status = filters.status;
      }

      if (search) {
        const regex = new RegExp(search, 'i');
        searchQuery = {
          ...whereQuery,
          $or: [{ status: regex }],
        };
      } else {
        searchQuery = whereQuery;
      }

      if (order.length && columns.length) {
        const sortByOrder: any = order.reduce((memo: any, ordr: any) => {
          memo[ordr.name] = ordr.dir === 'asc' ? 1 : -1;
          return memo;
        }, {});

        if (Object.keys(sortByOrder).length) {
          sort = sortByOrder;
        }
      }

      recordsTotal = await this.applicationModel.countDocuments({ job: jobId });
      recordsFiltered = await this.applicationModel.countDocuments(searchQuery);

      let results = await this.applicationModel
        .find(searchQuery)
        .populate('user', 'name email resume')
        .select('_id user status created_at')
        .skip(Number(start))
        .limit(Number(limit))
        .sort(sort)
        .exec();

      results = results.map((result: any) => {
        return {
          ...result.toObject(),
          user_name: result.user?.name || 'Unknown User',
          user_email: result.user?.email || 'Unknown Email',
          resume_url: result.user?.resume?.value || null,
          actions: result.user?.resume?.value
            ? [
                {
                  id: 1,
                  label: 'Download Resume',
                  type: 'download',
                  endpoint: `/api/v1/applications/${result._id}/resume`,
                  applicationId: result._id,
                  filename: `resume_${result.user.name.replace(
                    /\s+/g,
                    '_',
                  )}.pdf`,
                },
              ]
            : [],
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

  public async updateResumeDownloadStatus(applicationId: string) {
    return await this.applicationModel.findByIdAndUpdate(
      applicationId,
      { status: ApplicationStatusEnum.RESUME_DOWNLOADED },
      { new: true },
    );
  }
}
