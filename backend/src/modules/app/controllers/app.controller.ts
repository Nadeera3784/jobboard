import { Controller, Get, Header, Res } from '@nestjs/common';
import { GetSharedFiltersFeature } from '../features/get-shared-filters.feature';

@Controller('app')
export class AppController {
  constructor(
    private readonly getSharedFiltersFeature: GetSharedFiltersFeature,
  ) {}

  @Get('/shared/filters')
  @Header('Content-Type', 'application/json')
  public async getFilters(@Res() response) {
    const { status, response: featureUpResponse } =
      await this.getSharedFiltersFeature.handle();
    return response.status(status).json(featureUpResponse);
  }
}
