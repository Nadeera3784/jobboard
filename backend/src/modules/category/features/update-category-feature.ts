import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../core/features/base-feature';
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
        ResponseType.SUCCESS,
        'Category has been updated successfully',
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
