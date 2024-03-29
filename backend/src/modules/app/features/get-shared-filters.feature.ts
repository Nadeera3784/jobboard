import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from './base-feature';
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
      const filters = this.appService.getFilters();
      const locations = await this.locationService.getAll(
        {
          status: 'Active',
        },
      );
      const categories = await this.categoryService.getAll(
        {
          status: 'Active',
        }
      );

      const data = {
        locations: locations,
        categories: categories,
        ...filters,
      };

      return this.responseSuccess(
        HttpStatus.OK,
        null,
        data,
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
