import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { AnalyticService } from '../services';

@Injectable()
export class GetAnalyticByIdFeature extends Feature {
  constructor(private readonly analyticService: AnalyticService) {
    super();
  }

  public async handle(id: string) {
    try {
      const data = await this.analyticService.getByJobId(id);
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
