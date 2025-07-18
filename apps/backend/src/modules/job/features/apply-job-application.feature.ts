import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { ApplicationService } from '../services';
import { CreateApplicationDto } from '../dtos';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class ApplyJobApplicationFeature extends Feature {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly userService: UserService,
  ) {
    super();
  }

  public async handle(
    createApplicationDto: CreateApplicationDto,
    jobId: string,
    userId: string,
  ) {
    try {
      // Check if user profile is complete (has both image and resume)
      const user = await this.userService.getById(userId);
      if (!user) {
        return this.responseError(HttpStatus.NOT_FOUND, 'User not found');
      }

      // Check if profile is complete
      const hasProfilePicture = !!user.image?.value;
      const hasResume = !!user.resume?.value;

      if (!hasProfilePicture || !hasResume) {
        const missingItems = [];
        if (!hasProfilePicture) missingItems.push('profile picture');
        if (!hasResume) missingItems.push('resume');

        return this.responseError(
          HttpStatus.BAD_REQUEST,
          `Please complete your profile by uploading your ${missingItems.join(
            ' and ',
          )} before applying to jobs`,
        );
      }

      // Check if user has already applied for this job
      const hasAlreadyApplied = await this.applicationService.isApplied(
        jobId,
        userId,
      );
      if (hasAlreadyApplied) {
        return this.responseError(
          HttpStatus.CONFLICT,
          'You have already applied for this job',
        );
      }

      // Create the application
      await this.applicationService.create({ user: userId }, jobId);
      return this.responseSuccess(
        HttpStatus.OK,
        'Application submitted successfully! The company will review your application and get back to you.',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
