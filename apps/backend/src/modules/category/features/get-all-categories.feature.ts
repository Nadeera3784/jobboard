import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { CategoryService } from '../services/category.service';

@Injectable()
export class GetAllCategoriesFeature extends Feature {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  public async handle() {
    try {
      const data = await this.categoryService.getAll();
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
