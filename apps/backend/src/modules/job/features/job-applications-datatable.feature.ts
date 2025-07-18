import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { ApplicationService } from '../services';

@Injectable()
export class JobApplicationsDatatableFeature extends Feature {
  constructor(private readonly applicationService: ApplicationService) {
    super();
  }

  public async handle(
    jobId: string,
    order,
    columns,
    filters,
    search: string,
    limit: number,
    start: number,
  ) {
    try {
      const data = await this.applicationService.jobApplicationsDataTable(
        jobId,
        order,
        columns,
        filters,
        search,
        limit,
        start,
      );
      return this.responseSuccess(HttpStatus.OK, null, data);
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
