import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { AnalyticService } from '../services';

@Injectable()
export class DeleteAnalyticFeature extends Feature {
  constructor(private readonly analyticService: AnalyticService) {
    super();
  }

  public async handle(id: string) {
    try {
      await this.analyticService.delete(id);
      return this.responseSuccess(
        HttpStatus.OK,
        'Analytic has been deleted successfully',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
