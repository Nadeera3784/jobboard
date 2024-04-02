import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { LocationService } from '../services/location.service';

@Injectable()
export class DatatableFeature extends BaseFeature {
  constructor(private readonly locationService: LocationService) {
    super();
  }

  public async handle(request) {
    try {
      const data = await this.locationService.datatable(request);
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
