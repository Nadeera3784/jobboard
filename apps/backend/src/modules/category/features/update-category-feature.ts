import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { CategoryService } from '../services/category.service';
import { UpdateCategoryDto } from '../dtos/update-category.dto';

@Injectable()
export class UpdateCategorynFeature extends Feature {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  public async handle(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      await this.categoryService.update(id, updateCategoryDto);
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
