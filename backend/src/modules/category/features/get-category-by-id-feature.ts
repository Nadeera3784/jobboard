import { Injectable, HttpStatus } from '@nestjs/common';

import { Response as ResponseType } from '../../app/enums/response.enum';
import { BaseFeature } from '../../app/features/base-feature';
import { CategoryService } from '../services/category.service';

@Injectable()
export class GetCategoryByIdFeature extends BaseFeature {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  public async handle(id: string) {
    try {
      const data = await this.categoryService.getById(id);
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
