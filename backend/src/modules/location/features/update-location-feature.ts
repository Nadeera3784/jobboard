import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { LocationService } from '../services/location.service';
import { UpdateLocationDto } from '../dtos/update-location.dto';

@Injectable()
export class UpdateLocationFeature extends BaseFeature {
  constructor(private readonly locationService: LocationService) {
    super();
  }

  public async handle(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      await this.locationService.update(id, updateLocationDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'Location has been updated successfully',
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
