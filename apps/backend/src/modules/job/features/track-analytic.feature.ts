import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { JobService } from '../services/job.service';

@Injectable()
export class TrackAnalyticFeature extends Feature {
  constructor(private readonly jobService: JobService) {
    super();
  }

  public async handle(id: string) {
    try {
      const data = await this.jobService.getById(id);
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
