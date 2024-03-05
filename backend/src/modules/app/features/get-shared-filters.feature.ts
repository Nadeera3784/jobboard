import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
import { AppService } from '../services/app.service';
import { LocationService } from '../../location/services/location.service';
import { CategoryService } from '../../category/services/category.service';

@Injectable()
export class GetSharedFiltersFeature extends BaseFeature {
  constructor(
    private readonly appService: AppService,
    private readonly locationService: LocationService,
    private readonly categoryService: CategoryService,
  ) {
    super();
  }

  public async handle() {
    try {
      const fitlers = this.appService.getFilters();
      const locations = await this.locationService.getAll(
        {
          status: 'Active',
        },
        '_id name',
      );
      const categories = await this.categoryService.getAll(
        {
          status: 'Active',
        },
        '_id name',
      );

      const data = {
        locations: locations,
        categories: categories,
        ...fitlers,
      };

      return this.responseSuccess(
        HttpStatus.OK,
        ResponseType.SUCCESS,
        null,
        data,
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
