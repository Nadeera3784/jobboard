import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IdDto } from '../../app/dtos/Id.dto';
import {
  DeleteAnalyticFeature,
  GetAnalyticByIdFeature,
  UpdateAnalyticCountFeature,
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
