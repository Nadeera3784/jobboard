import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { LocationService } from '../services/location.service';
import { CreateLocationDto } from '../dtos/create-location.dto';

@Injectable()
export class CreateLocationFeature extends BaseFeature {
  constructor(private readonly locationService: LocationService) {
    super();
  }

  public async handle(createLocationDto: CreateLocationDto) {
    try {
      await this.locationService.create(createLocationDto);
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'Location has been created successfully',
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
