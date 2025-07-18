import { Module } from '@nestjs/common';
import { AIService } from './services';

@Module({
  providers: [AIService],
  exports: [AIService],
})
export class AIModule {}
