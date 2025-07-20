import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { JobService } from '../services';
import { UpdateJobDto } from '../dtos';

@Injectable()
export class UpdateJobFeature extends Feature {
  constructor(private readonly jobService: JobService) {
    super();
  }

  public async handle(id: string, updateJobDto: UpdateJobDto, userId?: string) {
    try {
      const existingJob = await this.jobService.getById(id);

      if (!existingJob) {
        return this.responseError(HttpStatus.NOT_FOUND, 'Job not found');
      }

      if (userId && existingJob.user.toString() !== userId) {
        return this.responseError(
          HttpStatus.FORBIDDEN,
          'You do not have permission to update this job',
        );
      }

      await this.jobService.update(id, updateJobDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'Job has been updated successfully',
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
