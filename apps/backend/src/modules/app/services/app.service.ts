import { Injectable } from '@nestjs/common';

import { SharedFilters } from '../../../config/shared-filters';

@Injectable()
export class AppService {
  public getFilters() {
    const sharedFilters = SharedFilters();
    return {
      remote: sharedFilters.remote,
      job_type: sharedFilters.job_type,
      experience_level: sharedFilters.experience_level,
    };
  }
}
