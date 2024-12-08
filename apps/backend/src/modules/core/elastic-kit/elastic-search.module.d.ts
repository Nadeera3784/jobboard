import { DynamicModule } from '@nestjs/common';
import { ElasticSearchConfig } from './elastic-search.config';
export declare class ElasticSearchModule {
    static forRoot(config: ElasticSearchConfig): DynamicModule;
}
