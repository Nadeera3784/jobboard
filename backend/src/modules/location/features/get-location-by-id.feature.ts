import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { LocationService } from '../services/location.service';

@Injectable()
export class GetLocationByIdFeature extends BaseFeature {
  constructor(private readonly locationService: LocationService) {
    super();
  }

  public async handle(id: string) {
    try {
      const data = await this.locationService.getById(id);
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
