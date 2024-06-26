import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { JobService } from '../services';
import { CreateJobDto } from '../dtos';

@Injectable()
export class CreateJobFeature extends Feature {
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
