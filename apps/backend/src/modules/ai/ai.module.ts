import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AIService } from './services';

@Module({
  providers: [AIService],
  exports: [AIService],
})
export class AIModule implements NestModule {
  public configure(): MiddlewareConsumer | void {}
}
