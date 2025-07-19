import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';

import { Feature } from '../../app/features/feature';
import { RolesEnum } from '../../user/enums';

@Injectable()
export class GetAdminAnalyticsFeature extends Feature {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    @InjectModel('Job') private readonly jobModel: Model<any>,
    @InjectModel('Application') private readonly applicationModel: Model<any>,
    @InjectModel('Category') private readonly categoryModel: Model<any>,
    @InjectModel('Location') private readonly locationModel: Model<any>,
    @InjectModel('Analytic') private readonly analyticModel: Model<any>,
  ) {
    super();
  }

  public async handle() {
    try {

      const totalUsers = await this.userModel.countDocuments({
        role: RolesEnum.USER,
      });

      const totalCompanies = await this.userModel.countDocuments({
        role: RolesEnum.COMPANY,
      });

      const totalJobs = await this.jobModel.countDocuments();
      const activeJobs = await this.jobModel.countDocuments({
        status: 'Active',
      });
      const totalApplications = await this.applicationModel.countDocuments();
      const totalCategories = await this.categoryModel.countDocuments();
      const totalLocations = await this.locationModel.countDocuments();

      // Recent activity (last 30 days)
      const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
      const sevenDaysAgo = moment().subtract(7, 'days').toDate();

      const recentUsers = await this.userModel.countDocuments({
        role: RolesEnum.USER,
        created_at: { $gte: thirtyDaysAgo },
      });

      const recentCompanies = await this.userModel.countDocuments({
        role: RolesEnum.COMPANY,
        created_at: { $gte: thirtyDaysAgo },
      });

      const recentJobs = await this.jobModel.countDocuments({
        created_at: { $gte: thirtyDaysAgo },
      });

      const recentApplications = await this.applicationModel.countDocuments({
        created_at: { $gte: thirtyDaysAgo },
      });

      // Weekly activity
      const weeklyUsers = await this.userModel.countDocuments({
        role: RolesEnum.USER,
        created_at: { $gte: sevenDaysAgo },
      });

      const weeklyJobs = await this.jobModel.countDocuments({
        created_at: { $gte: sevenDaysAgo },
      });

      const weeklyApplications = await this.applicationModel.countDocuments({
        created_at: { $gte: sevenDaysAgo },
      });

      // Top categories by job count
      const topCategories = await this.jobModel.aggregate([
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryInfo',
          },
        },
        {
          $unwind: '$categoryInfo',
        },
        {
          $group: {
            _id: '$category',
            name: { $first: '$categoryInfo.name' },
            jobCount: { $sum: 1 },
          },
        },
        {
          $sort: { jobCount: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      // Top locations by job count
      const topLocations = await this.jobModel.aggregate([
        {
          $lookup: {
            from: 'locations',
            localField: 'location',
            foreignField: '_id',
            as: 'locationInfo',
          },
        },
        {
          $unwind: '$locationInfo',
        },
        {
          $group: {
            _id: '$location',
            name: { $first: '$locationInfo.name' },
            jobCount: { $sum: 1 },
          },
        },
        {
          $sort: { jobCount: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      // Most active companies (by job posts)
      const topCompanies = await this.jobModel.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'companyInfo',
          },
        },
        {
          $unwind: '$companyInfo',
        },
        {
          $group: {
            _id: '$user',
            name: { $first: '$companyInfo.name' },
            jobCount: { $sum: 1 },
          },
        },
        {
          $sort: { jobCount: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      // Application status breakdown
      const applicationStatus = await this.applicationModel.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      // Monthly growth trends (last 6 months)
      const sixMonthsAgo = moment()
        .subtract(6, 'months')
        .startOf('month')
        .toDate();

      const monthlyUserGrowth = await this.userModel.aggregate([
        {
          $match: {
            role: RolesEnum.USER,
            created_at: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$created_at' },
              month: { $month: '$created_at' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]);

      const monthlyJobGrowth = await this.jobModel.aggregate([
        {
          $match: {
            created_at: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$created_at' },
              month: { $month: '$created_at' },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]);

      // Total analytics views
      const totalViews = await this.analyticModel.aggregate([
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$view_count' },
          },
        },
      ]);

      const analytics = {
        overview: {
          totalUsers,
          totalCompanies,
          totalJobs,
          activeJobs,
          totalApplications,
          totalCategories,
          totalLocations,
          totalViews: totalViews[0]?.totalViews || 0,
        },
        recentActivity: {
          last30Days: {
            users: recentUsers,
            companies: recentCompanies,
            jobs: recentJobs,
            applications: recentApplications,
          },
          last7Days: {
            users: weeklyUsers,
            jobs: weeklyJobs,
            applications: weeklyApplications,
          },
        },
        topCategories: topCategories.map((cat) => ({
          name: cat.name,
          jobCount: cat.jobCount,
        })),
        topLocations: topLocations.map((loc) => ({
          name: loc.name,
          jobCount: loc.jobCount,
        })),
        topCompanies: topCompanies.map((comp) => ({
          name: comp.name,
          jobCount: comp.jobCount,
        })),
        applicationStatus: applicationStatus.reduce((acc, status) => {
          acc[status._id] = status.count;
          return acc;
        }, {}),
        growth: {
          monthlyUsers: monthlyUserGrowth.map((item) => ({
            month: `${item._id.year}-${String(item._id.month).padStart(
              2,
              '0',
            )}`,
            count: item.count,
          })),
          monthlyJobs: monthlyJobGrowth.map((item) => ({
            month: `${item._id.year}-${String(item._id.month).padStart(
              2,
              '0',
            )}`,
            count: item.count,
          })),
        },
        systemHealth: {
          averageApplicationsPerJob:
            totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : '0',
          averageViewsPerJob:
            totalJobs > 0
              ? ((totalViews[0]?.totalViews || 0) / totalJobs).toFixed(1)
              : '0',
          jobCompletionRate:
            totalJobs > 0 ? ((activeJobs / totalJobs) * 100).toFixed(1) : '0',
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
