import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dtos/create-category.dto';

@Injectable()
export class CreateCategoryFeature extends BaseFeature {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  public async handle(createCategoryDto: CreateCategoryDto) {
    try {
      await this.categoryService.create(createCategoryDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'Category has been created successfully',
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
