import { ElasticSearchQueryDto } from './elastic-search-query.dto';

export class HasChildFilterDto {
  type: string;
  query: ElasticSearchQueryDto;
}
