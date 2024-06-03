import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { CategoryService } from '../services/category.service';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable()
export class UpdateCategorynFeature extends BaseFeature {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  public async handle(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await await this.categoryService.update(id, updateCategoryDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'Category has been updated successfully',
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
