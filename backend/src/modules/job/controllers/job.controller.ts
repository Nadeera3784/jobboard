import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import { CreateJobFeature, GetAllJobsFeature } from '../features';
import { Roles } from '../../user/enums';
import { CreateJobDto } from '../dtos';
import { RolesAllowed } from '../../auth/decorators/role.decorator';
import {
  JobFilterInterface,
  JobOrderInterface,
  JobSearchInterface,
} from '../interfaces';

@Controller('jobs')
//@UseGuards(AuthGuard, RoleGuard)
export class JobController {
  constructor(
    private readonly createJobFeature: CreateJobFeature,
    private readonly getAllJobsFeature: GetAllJobsFeature,
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
        JSON.parse(order),
        Number(limit),
        Number(page),
      );
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
