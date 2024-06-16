import { Module } from '@nestjs/common';
import {
  OpenAIService,
  OpenAIProviderService,
  AIJobMatcherService,
} from './services';

@Module({
  providers: [OpenAIProviderService, OpenAIService, AIJobMatcherService],
  exports: [AIJobMatcherService],
})
export class AIModule {}
