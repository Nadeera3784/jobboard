import { Injectable, HttpStatus } from '@nestjs/common';

import { BaseFeature } from '../../app/features/base-feature';
import { JobService } from '../services';
import { CreateJobDto } from '../dtos';

@Injectable()
export class CreateJobFeature extends BaseFeature {
  constructor(private readonly jobService: JobService) {
    super();
  }

  public async handle(createJobDto: CreateJobDto) {
    try {
      await this.jobService.create(createJobDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'Job has been created successfully',
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
