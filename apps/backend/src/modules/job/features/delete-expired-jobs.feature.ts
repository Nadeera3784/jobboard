import { Injectable } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { JobService } from '../services';

@Injectable()
export class DeleteExpiredJobsFeature extends Feature {
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
