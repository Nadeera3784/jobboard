import { ElasticSearchQueryDto } from './elastic-search-query.dto';

export class NestedConditionDto {
    path: string;
    query: ElasticSearchQueryDto;
}