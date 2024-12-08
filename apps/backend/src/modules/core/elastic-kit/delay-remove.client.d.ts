import { Logger } from '@nestjs/common';
import { ElasticSearchClient } from './elastic-search.client';
export declare class DelayRemoveClient {
    private readonly client;
    private readonly logger;
    private retries;
    private maxRetries;
    private timeout;
    constructor(client: ElasticSearchClient, logger: Logger);
    deleteByQuery(index: string, type: string, search: any): Promise<void>;
}
