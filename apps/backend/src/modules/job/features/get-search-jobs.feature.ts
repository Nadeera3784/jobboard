import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { JobService } from '../services';
import {
  JobFilterInterface,
  JobOrderInterface,
  JobSearchInterface,
} from '../interfaces';

@Injectable()
export class GetSearchJobsFeature extends Feature {
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
      const jobs = await this.jobService.getSearch(
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
