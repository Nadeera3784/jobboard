import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';

import { Feature } from '../../app/features/feature';
import { AnalyticService } from '../services';

@Injectable()
export class GetCompanyAnalyticsFeature extends Feature {
  constructor(
    private readonly analyticService: AnalyticService,
    @InjectModel('Job') private readonly jobModel: Model<any>,
    @InjectModel('Application') private readonly applicationModel: Model<any>,
  ) {
    super();
  }

  public async handle(companyId: string) {
    try {
      // Validate that companyId is a valid MongoDB ObjectId
      if (!Types.ObjectId.isValid(companyId)) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          'Invalid company ID format',
        );
      }

      const companyObjectId = new Types.ObjectId(companyId);

      // Get total jobs by company
      const totalJobs = await this.jobModel.countDocuments({
        user: companyObjectId,
      });

      // Get active jobs
      const activeJobs = await this.jobModel.countDocuments({
        user: companyObjectId,
        status: 'Active',
      });

      // Get total applications across all company jobs
      const totalApplicationsPipeline = [
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
            'jobInfo.user': companyObjectId,
          },
        },
        {
          $count: 'total',
        },
      ];

      const totalApplicationsResult = await this.applicationModel.aggregate(
        totalApplicationsPipeline,
      );
      const totalApplications = totalApplicationsResult[0]?.total || 0;

      // Get recent applications (last 30 days)
      const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
      const recentApplicationsPipeline = [
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
            'jobInfo.user': companyObjectId,
            created_at: { $gte: thirtyDaysAgo },
          },
        },
        {
          $count: 'total',
        },
      ];

      const recentApplicationsResult = await this.applicationModel.aggregate(
        recentApplicationsPipeline,
      );
      const recentApplications = recentApplicationsResult[0]?.total || 0;

      // Get analytics data (views) from analytics collection
      const analyticsData = await this.analyticService.getCompanyAnalytics(
        companyId,
      );

      // Get jobs expiring soon (next 7 days)
      const sevenDaysFromNow = moment().add(7, 'days').toDate();
      const jobsExpiringSoon = await this.jobModel.countDocuments({
        user: companyObjectId,
        status: 'Active',
        expired_at: { $lte: sevenDaysFromNow, $gte: new Date() },
      });

      const analytics = {
        totalJobs,
        activeJobs,
        totalApplications,
        recentApplications,
        totalViews: analyticsData.totalViews || 0,
        jobsExpiringSoon,
        performance: {
          averageApplicationsPerJob:
            totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : '0',
          averageViewsPerJob:
            totalJobs > 0
              ? (analyticsData.totalViews / totalJobs).toFixed(1)
              : '0',
        },
      };

      return this.responseSuccess(HttpStatus.OK, null, analytics);
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
