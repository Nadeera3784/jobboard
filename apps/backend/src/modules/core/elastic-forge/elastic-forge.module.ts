import { Global, Module, DynamicModule } from '@nestjs/common';
import { DelayRemoveClient } from './delay-remove.client';
import { ElasticSearchClient } from './elastic-search.client';
import { ElasticSearchConfig } from './elastic-search.config';

@Global()
@Module({
  exports: [DelayRemoveClient, ElasticSearchClient],
  providers: [DelayRemoveClient, ElasticSearchClient],
})
export class ElasticForgehModule {
  static forRoot(config: ElasticSearchConfig): DynamicModule {
    return {
      exports: [],
      module: ElasticForgehModule,
      providers: [
        {
          provide: ElasticSearchConfig,
          useValue: config,
        },
      ],
    };
  }
}
