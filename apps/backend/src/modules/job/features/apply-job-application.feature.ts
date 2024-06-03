import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { ApplicationService } from '../services';
import { CreateApplicationDto } from '../dtos';

@Injectable()
export class ApplyJobApplicationFeature extends BaseFeature {
  constructor(private readonly applicationService: ApplicationService) {
    super();
  }

  public async handle(createApplicationDto: CreateApplicationDto, id: string) {
    try {
      await this.applicationService.create(createApplicationDto, id);
      return this.responseSuccess(
        HttpStatus.OK,
        'Application has been created successfully',
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
