import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Analytic } from '../schemas';
import { UpdateCountDto } from '../dtos';

@Injectable()
export class AnalyticService {
  constructor(
    @InjectModel(Analytic.name) private readonly analyticModel: Model<Analytic>,
  ) {}

  public async updateOrCreatCount(updateCountDto: UpdateCountDto) {
    return this.analyticModel
      .findOneAndUpdate(
        { job: updateCountDto.job },
        { $inc: { [updateCountDto.type]: 1 } },
        { new: true, upsert: true },
      )
      .exec();
  }

  public async getByJobId(id: string) {
    return this.analyticModel.findById(id);
  }

  public async delete(id: string) {
    return this.analyticModel.findByIdAndDelete(id);
  }

  public async getCompanyAnalytics(companyId: string) {
    const pipeline = [
      {
        $lookup: {
          from: 'jobs',
          localField: 'job',
          foreignField: '_id',
          as: 'jobInfo',
        },
      },
      {
        $unwind: '$jobInfo',
      },
      {
        $match: {
          'jobInfo.user': new Types.ObjectId(companyId),
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$view_count' },
          totalApplications: { $sum: '$application_count' },
          jobCount: { $sum: 1 },
        },
      },
    ];

    const result = await this.analyticModel.aggregate(pipeline);
    return result[0] || { totalViews: 0, totalApplications: 0, jobCount: 0 };
  }
}
