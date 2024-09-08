import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import {
  CreateJobFeature,
  GetSearchJobsFeature,
  GetAllJobsFeature,
  GetJobByIdFeature,
} from '../features';
import { RolesEnum } from '../../user/enums';
import { CreateJobDto } from '../dtos';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import {
  JobFilterInterface,
  JobOrderInterface,
  JobSearchInterface,
} from '../interfaces';
import { IdDto } from '../../app/dtos/Id.dto';
import { AuthenticationGuard } from '../../authentication/guards/authentication.guard';
import { RoleGuard } from '../../authentication/guards/role.guard';
import { AIJobOutLineGeneratorService } from '../../ai/services';
import { AssociativeObject } from 'src/modules/ai/interfaces';

@Controller('jobs')
export class JobController {
  constructor(
    private readonly createJobFeature: CreateJobFeature,
    private readonly getSearchJobsFeature: GetSearchJobsFeature,
    private readonly getJobByIdFeature: GetJobByIdFeature,
    private readonly getAllJobsFeature: GetAllJobsFeature,
    private readonly aiJobOutLineGeneratorService: AIJobOutLineGeneratorService,
  ) {}

  @Post('/datatable')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
  public async dataTable(
    @Res() response: Response,
    @Body('order') order: any,
    @Body('columns') columns: any,
    @Body('filters') filters: any,
    @Body('search') search: string,
    @Body('limit') limit: number,
    @Body('start') start: number,
  ) {
    const { status, response: featureUpResponse } =
      await this.getAllJobsFeature.handle(
        order,
        columns,
        filters,
        search,
        limit,
        start,
      );
    return response.status(status).json(featureUpResponse);
  }

  @Get('/search')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async getSearch(
    @Res() response: Response,
    @Query('filter') filter: JobFilterInterface,
    @Query('search') search: JobSearchInterface,
    @Query('order') order: JobOrderInterface,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const { status, response: featureUpResponse } =
      await this.getSearchJobsFeature.handle(
        filter,
        search,
        order,
        Number(limit),
        Number(page),
      );
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.ADMIN)
  public async getById(@Res() response: Response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.getJobByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
  public async create(
    @Res() response: Response,
    @Body() createJobDto: CreateJobDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.createJobFeature.handle(createJobDto);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/outline-generator')
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
  public async aiOutLineGenearotr(
    @Res() response: Response,
  ) {
    const data: AssociativeObject = {
      job_descrption: '<job_descrption>Design, develop, and maintain robust and scalable web applications across the entire software development lifecycle, specifically using the MERN stack<job_descrption>/>'
    };

    const x = await this.aiJobOutLineGeneratorService.handle(data);

    console.log('BOOM', x.metadata.notes);
  }
}
