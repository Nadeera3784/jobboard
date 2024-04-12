import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { JobService } from '../services';
import {
  JobFilterInterface,
  JobOrderInterface,
  JobSearchInterface,
} from '../interfaces';

@Injectable()
export class GetAllJobsFeature extends BaseFeature {
  constructor(private readonly jobService: JobService) {
    super();
  }

  public async handle(
    filter: JobFilterInterface,
    search: JobSearchInterface,
    order: JobOrderInterface,
    limit: number,
    page: number,
  ) {
    try {
      const jobs = await this.jobService.getAll(
        filter,
        search,
        order,
        limit,
        page,
      );
      return this.responseSuccess(HttpStatus.OK, null, jobs);
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
