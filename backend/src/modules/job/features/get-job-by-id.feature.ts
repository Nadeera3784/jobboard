import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { JobService } from '../services/job.service';

@Injectable()
export class GetJobByIdFeature extends BaseFeature {
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
