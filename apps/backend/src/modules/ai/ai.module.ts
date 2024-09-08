import { Module } from '@nestjs/common';
import {
  OpenAIService,
  OpenAIProviderService,
  AIJobMatcherService,
  AIJobOutLineGeneratorService
} from './services';

@Module({
  providers: [OpenAIProviderService, OpenAIService, AIJobMatcherService, AIJobOutLineGeneratorService],
  exports: [AIJobMatcherService, AIJobOutLineGeneratorService],
})
export class AIModule {}
