import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IdDto } from '../../app/dtos/Id.dto';
import {
  DeleteAnalyticFeature,
  GetAnalyticByIdFeature,
  UpdateAnalyticCountFeature,
  GetCompanyAnalyticsFeature,
  GetUserAnalyticsFeature,
  GetAdminAnalyticsFeature,
} from '../features';
import { UpdateCountDto } from '../dtos';
import { AuthenticationGuard, RoleGuard } from '../../authentication/guards';
import { RolesAllowed } from '../../authentication/decorators/role.decorator';
import { RolesEnum } from '../../user/enums';

@Controller('analytics')
export class AnalyticController {
  constructor(
    private readonly deleteAnalyticFeature: DeleteAnalyticFeature,
    private readonly getAnalyticByIdFeature: GetAnalyticByIdFeature,
    private readonly updateAnalyticCountFeature: UpdateAnalyticCountFeature,
    private readonly getCompanyAnalyticsFeature: GetCompanyAnalyticsFeature,
    private readonly getUserAnalyticsFeature: GetUserAnalyticsFeature,
    private readonly getAdminAnalyticsFeature: GetAdminAnalyticsFeature,
  ) {}

  @Post()
  @Header('Content-Type', 'application/json')
  public async updateViewCount(
    @Res() response,
    @Body() updateCountDto: UpdateCountDto,
  ) {
    const { status, response: featureUpResponse } =
      await this.updateAnalyticCountFeature.handle(updateCountDto);
    return response.status(status).json(featureUpResponse);
  }

  @Get('/admin')
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.ADMIN)
  public async getAdminAnalytics(@Res() response) {
    const { status, response: featureUpResponse } =
      await this.getAdminAnalyticsFeature.handle();
    return response.status(status).json(featureUpResponse);
  }

  @Get('/company')
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.COMPANY)
  public async getCompanyAnalytics(@Res() response, @Req() request) {
    const { status, response: featureUpResponse } =
      await this.getCompanyAnalyticsFeature.handle(request.user.id);
    return response.status(status).json(featureUpResponse);
  }

  @Get('/user')
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.USER)
  public async getUserAnalytics(@Res() response, @Req() request) {
    const { status, response: featureUpResponse } =
      await this.getUserAnalyticsFeature.handle(request.user.id);
    return response.status(status).json(featureUpResponse);
  }

  @Get('/:id')
  @Header('Content-Type', 'application/json')
  public async getByJobId(@Res() response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.getAnalyticByIdFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }

  @Delete('/:id')
  @Header('Content-Type', 'application/json')
  @UseGuards(AuthenticationGuard, RoleGuard)
  @RolesAllowed(RolesEnum.ADMIN, RolesEnum.COMPANY)
  public async delete(@Res() response, @Param() { id }: IdDto) {
    const { status, response: featureUpResponse } =
      await this.deleteAnalyticFeature.handle(id);
    return response.status(status).json(featureUpResponse);
  }
}
