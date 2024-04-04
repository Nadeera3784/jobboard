import { Body, Controller, Header, Post, Res } from '@nestjs/common';

import {
    CreateJobFeature
} from '../features';
import { Roles } from '../../user/enums';
import { CreateJobDto } from '../dtos';
import { RolesAllowed } from '../../auth/decorators/role.decorator';

@Controller('jobs')
//@UseGuards(AuthGuard, RoleGuard)
export class JobController {
    constructor(
        private readonly createJobFeature: CreateJobFeature,
    ) {}

    @Post()
    @Header('Content-Type', 'application/json')
    @RolesAllowed(Roles.ADMIN)
    public async create(@Res() response, @Body() createJobDto: CreateJobDto) {
      const { status, response: featureUpResponse } =
        await this.createJobFeature.handle(createJobDto);
      return response.status(status).json(featureUpResponse);
    }
}
