import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { LocationService } from '../services/location.service';

@Injectable()
export class DatatableFeature extends Feature {
  constructor(private readonly locationService: LocationService) {
    super();
  }

  public async handle(
    order,
    columns,
    filters,
    search: string,
    limit: number,
    start: number,
  ) {
    try {
      const data = await this.locationService.datatable(
        order,
        columns,
        filters,
        search,
        limit,
        start,
      );
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
