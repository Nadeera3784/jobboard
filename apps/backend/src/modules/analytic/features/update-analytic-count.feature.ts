import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { AnalyticService } from '../services';
import { UpdateCountDto } from '../dtos';

@Injectable()
export class UpdateAnalyticCountFeature extends Feature {
  constructor(private readonly analyticService: AnalyticService) {
    super();
  }

  public async handle(updateCountDto: UpdateCountDto) {
    try {
      await this.analyticService.updateOrCreatCount(updateCountDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'Analytic has been updated successfully',
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
