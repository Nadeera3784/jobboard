import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
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
        ResponseType.SUCCESS,
        'Location has been updated successfully',
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        ResponseType.ERROR,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
