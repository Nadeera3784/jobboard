import { ElasticSearchExpressionDto } from './elastic-search-expression.dto';

export class ElasticSearchConditionsDto {
    must: ElasticSearchExpressionDto[] = [];
    must_not: ElasticSearchExpressionDto[] = [];
    should: ElasticSearchExpressionDto[] = [];
}