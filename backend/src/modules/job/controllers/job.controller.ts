import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import {
  CreateJobFeature,
  GetAllJobsFeature,
  GetJobByIdFeature,
} from '../features';
import { Roles } from '../../user/enums';
import { CreateJobDto } from '../dtos';
import { RolesAllowed } from '../../auth/decorators/role.decorator';
import {
  JobFilterInterface,
  JobOrderInterface,
  JobSearchInterface,
} from '../interfaces';
import { IdDto } from '../../app/dtos/Id.dto';

@Controller('jobs')
//@UseGuards(AuthGuard, RoleGuard)
export class JobController {
  constructor(
    private readonly createJobFeature: CreateJobFeature,
    private readonly getAllJobsFeature: GetAllJobsFeature,
    private readonly getJobByIdFeature: GetJobByIdFeature,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async getAll(
    @Res() response,
    @Query('filter') filter: JobFilterInterface,
    @Query('search') search: JobSearchInterface,
    @Query('order') order: JobOrderInterface,
    @Query('limit') limit: number,
    @Query('page') page: number,
  ) {
    const { status, response: featureUpResponse } =
      await this.getAllJobsFeature.handle(
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
  @RolesAllowed(Roles.ADMIN)
  public async getById(@Res() response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.getJobByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async create(@Res() response, @Body() createJobDto: CreateJobDto) {
    const { status, response: featureUpResponse } =
      await this.createJobFeature.handle(createJobDto);
    return response.status(status).json(featureUpResponse);
  }
}
