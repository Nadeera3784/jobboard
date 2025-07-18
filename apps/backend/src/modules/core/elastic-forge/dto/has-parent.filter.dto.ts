import { ElasticSearchQueryDto } from './elastic-search-query.dto';

export class HasParentFilterDto {
  parent_type: string;
  query: ElasticSearchQueryDto;
}
