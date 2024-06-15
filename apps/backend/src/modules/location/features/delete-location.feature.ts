import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { LocationService } from '../services/location.service';

@Injectable()
export class DeleteLocationFeature extends Feature {
  constructor(private readonly locationService: LocationService) {
    super();
  }

  public async handle(id: string) {
    try {
      await this.locationService.delete(id);
      return this.responseSuccess(
        HttpStatus.OK,
        'Location has been deleted successfully',
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
