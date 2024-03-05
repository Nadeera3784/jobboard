import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { LocationService } from '../services/location.service';

@Injectable()
export class DeleteLocationFeature extends BaseFeature {
  constructor(private readonly locationService: LocationService) {
    super();
  }

  public async handle(id: string) {
    try {
      await this.locationService.delete(id);
      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        'Location has been deleted successfully',
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
