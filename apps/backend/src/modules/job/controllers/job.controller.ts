import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import {
  CreateJobFeature,
  GetSearchJobsFeature,
  GetAllJobsFeature,
  GetJobByIdFeature,
  UpdateJobFeature,
  GenerateJobDescriptionFeature,
} from '../features';
import { RolesEnum } from '../../user/enums';
import { CreateJobDto, UpdateJobDto, GenerateJobDescriptionDto } from '../dtos';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import {
  JobFilterInterface,
  JobOrderInterface,
  JobSearchInterface,
} from '../interfaces';
import { IdDto } from '../../app/dtos/Id.dto';
import { AuthenticationGuard } from '../../authentication/guards/authentication.guard';
import { RoleGuard } from '../../authentication/guards/role.guard';


@Controller('jobs')
export class JobController {
  constructor(
    private readonly createJobFeature: CreateJobFeature,
    private readonly getSearchJobsFeature: GetSearchJobsFeature,
    private readonly getJobByIdFeature: GetJobByIdFeature,
    private readonly getAllJobsFeature: GetAllJobsFeature,
    private readonly updateJobFeature: UpdateJobFeature,
    private readonly generateJobDescriptionFeature: GenerateJobDescriptionFeature,
  ) {}

  @Post('/datatable')
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
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
    const userId =
      request.user.role === RolesEnum.COMPANY ? request.user.id : null;

    const { status, response: featureUpResponse } =
      await this.getAllJobsFeature.handle(
        order,
        columns,
        filters,
        search,
        limit,
        start,
        userId,
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
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY, RolesEnum.USER)
  public async getById(
    @Req() request,
    @Res() response: Response,
    @Param() { id }: IdDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.getJobByIdFeature.handle(
        id,
        request.user.role === RolesEnum.COMPANY ? request.user.id : null,
      );
    return response.status(status).json(featureUpResponse);
  }

  @Put('/:id')
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
  public async update(
    @Req() request,
    @Res() response: Response,
    @Param() { id }: IdDto,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.updateJobFeature.handle(
        id,
        updateJobDto,
        request.user.role === RolesEnum.COMPANY ? request.user.id : null,
      );
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

  @Post('/generate-description')
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
  public async generateJobDescription(
    @Res() response: Response,
    @Body() generateJobDescriptionDto: GenerateJobDescriptionDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.generateJobDescriptionFeature.handle(generateJobDescriptionDto);
    return response.status(status).json(featureUpResponse);
  }
}
