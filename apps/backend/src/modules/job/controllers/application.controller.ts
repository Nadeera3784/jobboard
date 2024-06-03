import { Body, Controller, Header, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { IdDto } from '../../app/dtos/Id.dto';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import { RolesEnum } from '../../user/enums';
import { ApplyJobApplicationFeature } from '../features';
import { CreateApplicationDto } from '../dtos';

@Controller('applications')
export class ApplicationController {
  constructor(
    private readonly applyJobApplicationFeature: ApplyJobApplicationFeature,
  ) {}

  @Post('/jobs/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(RolesEnum.USER)
  public async create(
    @Res() response: Response,
    @Body() createApplicationDto: CreateApplicationDto,
    @Param() { id }: IdDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.applyJobApplicationFeature.handle(createApplicationDto, id);
    return response.status(status).json(featureUpResponse);
  }
}
