import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { CreateLocationDto, UpdateLocationDto } from '../dtos';
import {
  CreateLocationFeature,
  DeleteLocationFeature,
  GetAllLocationsFeature,
  GetLocationByIdFeature,
  UpdateLocationFeature,
  DatatableFeature,
} from '../features';
import { RolesAllowed } from '../../auth/decorators/role.decorator';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Roles } from '../../user/enums/roles.enum';
import { IdDto } from '../../app/dtos/Id.dto';

@Controller('locations')
//@UseGuards(AuthGuard, RoleGuard)
export class LocationController {
  constructor(
    private readonly createLocationFeature: CreateLocationFeature,
    private readonly deleteLocationFeature: DeleteLocationFeature,
    private readonly getAllLocationsFeature: GetAllLocationsFeature,
    private readonly getLocationByIdFeature: GetLocationByIdFeature,
    private readonly updateLocationFeature: UpdateLocationFeature,
    private readonly datatableFeature: DatatableFeature,
  ) {}

  @Get()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async getAll(@Res() response) {
    const { status, response: featureUpResponse } =
      await this.getAllLocationsFeature.handle();
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async getById(@Res() response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.getLocationByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post()
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async create(
    @Res() response,
    @Body() createLocationDto: CreateLocationDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.createLocationFeature.handle(createLocationDto);
    return response.status(status).json(featureUpResponse);
  }

  @Put('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async update(
    @Res() response,
    @Param() { id }: IdDto,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.updateLocationFeature.handle(id, updateLocationDto);
    return response.status(status).json(featureUpResponse);
  }

  @Delete('/:id')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async delete(@Res() response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.deleteLocationFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Post('/datatable')
  @Header('Content-Type', 'application/json')
  @RolesAllowed(Roles.ADMIN)
  public async dataTable(@Req() request, @Res() response) {
    const { status, response: featureUpResponse } =
      await this.datatableFeature.handle(request);
    return response.status(status).json(featureUpResponse);
  }
}
