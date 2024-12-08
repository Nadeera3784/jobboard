import { ApiResponse } from '@elastic/elasticsearch';
import { Logger } from '@nestjs/common';
import { SearchResultBodyDto } from './dto';
import { ElasticSearchConfig } from './elastic-search.config';
import { ElasticFieldConfigInterface, ESSearchBody } from './interfaces';
export declare class ElasticSearchClient {
    private readonly logger;
    private readonly config;
    private client;
    constructor(logger: Logger, config: ElasticSearchConfig);
    addAlias(index: string, alias: string): Promise<void>;
    removeAlias(index: string, aliases: string[]): Promise<void>;
    getAlias(index: string): Promise<any>;
    isAliasExists(index: string, alias: string): Promise<boolean>;
    refresh(index: string): Promise<void>;
    singleIndex(index: string, record: any, logSuccess?: boolean): Promise<void>;
    bulkIndex(index: string, records: any[], routing?: any): Promise<void>;
    rename(oldIndex: string, newIndex: string): Promise<void>;
    drop(index: string): Promise<void>;
    reIndex(oldIndex: string, newIndex: string, callback: () => Promise<void>): Promise<void>;
    search<T = {
        [key: string]: any;
    }>(index: string, search: ESSearchBody): Promise<ApiResponse<SearchResultBodyDto<T>>>;
    count(index: string, search: ESSearchBody): Promise<ApiResponse<Record<string, any>, unknown>>;
    deleteByQuery(index: string, search: any): Promise<number>;
    createIndex(index: string): Promise<any>;
    closeIndex(index: string): Promise<void>;
    openIndex(index: string): Promise<void>;
    putIndexSettings(index: string, body: any): Promise<any>;
    isIndexExists(index: string): Promise<boolean>;
    setupFieldMapping(index: string, field: string, config: ElasticFieldConfigInterface): Promise<void>;
    updateByQuery(index: string, updateQuery: any): Promise<number>;
}
