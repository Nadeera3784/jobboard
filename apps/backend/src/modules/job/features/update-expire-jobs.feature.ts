import { Injectable } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { JobService } from '../services';
import { JobStatus } from '../enums';

@Injectable()
export class UpdateExpireJobsFeature extends BaseFeature {
  constructor(private readonly jobService: JobService) {
    super();
  }

  public async handle() {
    const jobs = await this.jobService.getActiveExpireJobs();
    jobs.eachAsync(async (job) => {
      await this.jobService.updateStatus(job._id, JobStatus.EXPIRED);
    });
  }
}
