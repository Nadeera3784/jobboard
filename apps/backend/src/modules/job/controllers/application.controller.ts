import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { IdDto } from '../../app/dtos/Id.dto';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import { RolesEnum } from '../../user/enums';
import {
  ApplyJobApplicationFeature,
  ApplicationDatatableFeature,
  JobApplicationsDatatableFeature,
  DownloadResumeFeature,
} from '../features';
import { CreateApplicationDto } from '../dtos';
import { AuthenticationGuard } from '../../authentication/guards/authentication.guard';
import { RoleGuard } from '../../authentication/guards/role.guard';
import { JobService, ApplicationService } from '../services';

@Controller('applications')
@UseGuards(AuthenticationGuard, RoleGuard)
export class ApplicationController {
  constructor(
    private readonly applyJobApplicationFeature: ApplyJobApplicationFeature,
    private readonly applicationDatatableFeature: ApplicationDatatableFeature,
    private readonly jobApplicationsDatatableFeature: JobApplicationsDatatableFeature,
    private readonly downloadResumeFeature: DownloadResumeFeature,
    private readonly jobService: JobService,
    private readonly applicationService: ApplicationService,
  ) {}

  @Post('/jobs/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.USER)
  public async create(
    @Req() request,
    @Res() response: Response,
    @Body() createApplicationDto: CreateApplicationDto,
    @Param() { id }: IdDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.applyJobApplicationFeature.handle(
        createApplicationDto,
        id,
        request.user.id,
      );
    return response.status(status).json(featureUpResponse);
  }

  @Post('/datatable')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.USER)
  public async dataTable(
    @Req() request,
    @Res() response: Response,
    @Body('order') order: any,
    @Body('columns') columns: any,
    @Body('filters') filters: any,
    @Body('search') search: string,
    @Body('limit') limit: number,
    @Body('start') start: number,
  ) {
    const { status, response: featureUpResponse } =
      await this.applicationDatatableFeature.handle(
        request.user.id,
        order,
        columns,
        filters,
        search,
        limit,
        start,
      );
    return response.status(status).json(featureUpResponse);
  }

  @Post('/jobs/:id/datatable')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
  public async jobApplicationsDataTable(
    @Req() request,
    @Res() response: Response,
    @Param() { id }: IdDto,
    @Body('order') order: any,
    @Body('columns') columns: any,
    @Body('filters') filters: any,
    @Body('search') search: string,
    @Body('limit') limit: number,
    @Body('start') start: number,
  ) {
    // If company role, verify they own the job
    if (request.user.role === RolesEnum.COMPANY) {
      const job = await this.jobService.getById(id);
      if (!job || job.user.toString() !== request.user.id) {
        return response.status(403).json({
          statusCode: 403,
          message:
            'You do not have permission to view applications for this job',
        });
      }
    }

    const { status, response: featureUpResponse } =
      await this.jobApplicationsDatatableFeature.handle(
        id,
        order,
        columns,
        filters,
        search,
        limit,
        start,
      );
    return response.status(status).json(featureUpResponse);
  }

  @Put('/:id/download-resume')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
  public async downloadResume(
    @Req() request,
    @Res() response: Response,
    @Param() { id }: IdDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.downloadResumeFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id/resume')
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
  public async getResume(
    @Req() request,
    @Res() response: Response,
    @Param() { id }: IdDto,
  ) {
    try {
      const application = await this.applicationService.getById(id);
      if (!application) {
        return response.status(404).json({
          statusCode: 404,
          message: 'Application not found',
        });
      }

      await application.populate('user', 'resume');
      const user = application.user as any;

      if (!user.resume?.value) {
        return response.status(404).json({
          statusCode: 404,
          message: 'Resume not found for this application',
        });
      }

      if (request.user.role === RolesEnum.COMPANY) {
        await application.populate('job', 'user');
        const job = application.job as any;
        if (!job || job.user.toString() !== request.user.id) {
          return response.status(403).json({
            statusCode: 403,
            message: 'You do not have permission to download this resume',
          });
        }
      }

      //TODO

      /*
      const fileResponse = await fetch(user.resume.value);
      
      if (!fileResponse.ok) {
        return response.status(404).json({
          statusCode: 404,
          message: 'Resume file not found',
        });
      }

      // Set appropriate headers for file download
      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader('Content-Disposition', `attachment; filename="resume_${user._id}.pdf"`);
      
      fileResponse.body.pipe(response);
    */
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'Failed to download resume',
      });
    }
  }
}
