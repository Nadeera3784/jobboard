import { ElasticSearchExpressionDto } from './elastic-search-expression.dto';
export declare class ElasticSearchConditionsDto {
    must: ElasticSearchExpressionDto[];
    must_not: ElasticSearchExpressionDto[];
    should: ElasticSearchExpressionDto[];
}
