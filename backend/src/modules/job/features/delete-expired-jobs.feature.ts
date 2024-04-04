import { Injectable } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { JobService } from '../services';

@Injectable()
export class DeleteExpiredJobsFeature extends BaseFeature {
  constructor(private readonly jobService: JobService) {
    super();
  }

  public async handle() {
    const jobs = await this.jobService.getExpiredJobs();
    jobs.eachAsync(async (job) => {
       this.jobService.delete(job._id);
    });
  }
}
