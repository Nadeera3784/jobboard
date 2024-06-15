import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { LocationService } from '../services/location.service';

@Injectable()
export class GetAllLocationsFeature extends Feature {
  constructor(private readonly locationService: LocationService) {
    super();
  }

  public async handle() {
    try {
      const data = await this.locationService.getAll();
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
