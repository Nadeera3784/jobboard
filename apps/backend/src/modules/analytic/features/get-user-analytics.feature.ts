import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as moment from 'moment';

import { Feature } from '../../app/features/feature';

@Injectable()
export class GetUserAnalyticsFeature extends Feature {
  constructor(
    @InjectModel('Application') private readonly applicationModel: Model<any>,
    @InjectModel('User') private readonly userModel: Model<any>,
  ) {
    super();
  }

  public async handle(userId: string) {
    try {
 
      if (!Types.ObjectId.isValid(userId)) {
        return this.responseError(
          HttpStatus.BAD_REQUEST,
          'Invalid user ID format',
        );
      }

      const userObjectId = new Types.ObjectId(userId);

      const user = await this.userModel
        .findById(userObjectId)
        .select('name email image resume phone created_at');
      if (!user) {
        return this.responseError(HttpStatus.NOT_FOUND, 'User not found');
      }

      const totalApplications = await this.applicationModel.countDocuments({
        user: userObjectId,
      });


      const applicationsByStatus = await this.applicationModel.aggregate([
        {
          $match: { user: userObjectId },
        },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);

      const thirtyDaysAgo = moment().subtract(30, 'days').toDate();
      const recentApplications = await this.applicationModel.countDocuments({
        user: userObjectId,
        created_at: { $gte: thirtyDaysAgo },
      });

      const sevenDaysAgo = moment().subtract(7, 'days').toDate();
      const weeklyApplications = await this.applicationModel.countDocuments({
        user: userObjectId,
        created_at: { $gte: sevenDaysAgo },
      });

      const profileFields = {
        hasName: !!user.name,
        hasEmail: !!user.email,
        hasImage: !!user.image?.value,
        hasResume: !!user.resume?.value,
        hasPhone: !!user.phone,
      };

      const completedFields =
        Object.values(profileFields).filter(Boolean).length;
      const totalFields = Object.keys(profileFields).length;
      const profileCompletionPercentage = Math.round(
        (completedFields / totalFields) * 100,
      );

      const statusBreakdown = {
        'Application submitted': 0,
        'Application viewed': 0,
        'Application rejected': 0,
        'Resume downloaded': 0,
      };

      applicationsByStatus.forEach((status) => {
        if (statusBreakdown.hasOwnProperty(status._id)) {
          statusBreakdown[status._id] = status.count;
        }
      });

      const latestApplications = await this.applicationModel
        .find({ user: userObjectId })
        .populate('job', 'name user')
        .populate({
          path: 'job',
          populate: {
            path: 'user',
            select: 'name',
          },
        })
        .sort({ created_at: -1 })
        .limit(5)
        .select('status created_at job');

      const analytics = {
        totalApplications,
        recentApplications,
        weeklyApplications,
        statusBreakdown,
        profileCompletion: {
          percentage: profileCompletionPercentage,
          completedFields,
          totalFields,
          missingFields: Object.entries(profileFields)
            .filter(([_, completed]) => !completed)
            .map(([field, _]) => field.replace('has', '').toLowerCase()),
        },
        latestApplications: latestApplications.map((app) => ({
          jobTitle: app.job?.name || 'Unknown Job',
          companyName: app.job?.user?.name || 'Unknown Company',
          status: app.status,
          appliedDate: app.created_at,
        })),
        accountAge: moment().diff(moment(user.created_at), 'days'),
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
