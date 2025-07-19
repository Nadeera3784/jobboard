import { Injectable, HttpStatus, Logger } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { JobService } from '../services/job.service';


@Injectable()
export class GetJobByIdFeature extends Feature {
  private readonly logger = new Logger(GetJobByIdFeature.name);

  constructor(
    private readonly jobService: JobService,
  ) {
    super();
  }

  public async handle(id: string, userId?: string) {
    try {
      const job = await this.jobService.getById(id);

      if (!job) {
        this.logger.warn(`Job not found: ${id}`);
        return this.responseError(HttpStatus.NOT_FOUND, 'Job not found');
      }

      return this.responseSuccess(HttpStatus.OK, null, job);
    } catch (error) {
      this.logger.error(`Error getting job by ID: ${id}`, error);
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
