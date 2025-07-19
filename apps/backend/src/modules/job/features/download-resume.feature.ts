import { Injectable, HttpStatus } from '@nestjs/common';

import { Feature } from '../../app/features/feature';
import { ApplicationService } from '../services';

@Injectable()
export class DownloadResumeFeature extends Feature {
  constructor(private readonly applicationService: ApplicationService) {
    super();
  }

  public async handle(applicationId: string) {
    try {
      const updatedApplication =
        await this.applicationService.updateResumeDownloadStatus(applicationId);

      if (!updatedApplication) {
        return this.responseError(
          HttpStatus.NOT_FOUND,
          'Application not found',
        );
      }

      return this.responseSuccess(
        HttpStatus.OK,
        'Resume download status updated successfully',
        { status: updatedApplication.status },
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
