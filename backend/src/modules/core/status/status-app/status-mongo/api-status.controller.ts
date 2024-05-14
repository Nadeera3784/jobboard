import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { existsSync, readFileSync } from 'fs';
import { MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('api')
@ApiTags('status')
export class ApiStatusHttpController {
  constructor(private mongoIndicator: MongooseHealthIndicator) {}

  @Get('status')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    description: 'Status of HTTP interface',
    status: HttpStatus.OK,
  })
  async status(): Promise<any> {
    return {
      mongo: await this.mongoIndicator.pingCheck('mongodb'),
      status: 'ok',
      version: existsSync('./version')
        ? readFileSync('./version', 'utf8').trim()
        : 'unknown',
    };
  }
}
