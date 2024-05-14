import { Module } from '@nestjs/common';
import { ApiStatusHttpController } from './api-status.controller';

@Module({
  controllers: [ApiStatusHttpController],
})
export class InnerStatusModule {}
