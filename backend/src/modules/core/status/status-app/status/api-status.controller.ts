import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';

@Controller('api')
export class ApiStatusHttpController {
  @Get('status')
  @HttpCode(HttpStatus.OK)
  async status(): Promise<{ status: string; version: string }> {
    return {
      status: 'ok',
      version: existsSync('./version')
        ? readFileSync('./version', 'utf8').trim()
        : 'unknown',
    };
  }
}
