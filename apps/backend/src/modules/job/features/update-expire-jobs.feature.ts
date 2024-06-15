import { Injectable } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { JobService } from '../services';
import { JobStatus } from '../enums';

@Injectable()
export class UpdateExpireJobsFeature extends Feature {
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
