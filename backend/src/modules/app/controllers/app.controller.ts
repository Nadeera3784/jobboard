import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/shared/filters')
  getFilters() {
    return this.appService.getFilters();
  }
}
