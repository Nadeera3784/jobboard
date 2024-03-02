import { Injectable } from '@nestjs/common';

import { SharedFilters } from '../../../config/shared-filters';

@Injectable()
export class AppService {
  
  public getFilters(){
    const sharedFilters = SharedFilters();
    return {
      remote: sharedFilters.remote,
      job_types: sharedFilters.job_types,
      experience_level: sharedFilters.experience_level
    };
  }
  
}
