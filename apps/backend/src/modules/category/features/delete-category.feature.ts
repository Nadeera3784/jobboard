import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { CategoryService } from '../services/category.service';

@Injectable()
export class DeleteCategoryFeature extends Feature {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  public async handle(id: string) {
    try {
      await this.categoryService.delete(id);
      return this.responseSuccess(
        HttpStatus.OK,
        'Category has been deleted successfully',
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
