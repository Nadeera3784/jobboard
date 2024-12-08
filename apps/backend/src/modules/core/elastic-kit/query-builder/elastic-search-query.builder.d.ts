import { ElasticSearchExpressionDto, ElasticSearchQueryDto } from '../dto';
export declare class ElasticSearchQueryBuilder {
    private query;
    private storedFields;
    private orderBy;
    private limit;
    private offsetValue;
    constructor();
    getQuery(): ElasticSearchQueryDto;
    getRequest(): any;
    must(condition: ElasticSearchExpressionDto): ElasticSearchQueryBuilder;
    mustNot(condition: ElasticSearchExpressionDto): ElasticSearchQueryBuilder;
    should(condition: ElasticSearchExpressionDto): ElasticSearchQueryBuilder;
    shouldNot(condition: ElasticSearchExpressionDto): ElasticSearchQueryBuilder;
    addSort(fieldName: string, direction: string): ElasticSearchQueryBuilder;
    size(size: number): ElasticSearchQueryBuilder;
    offset(offset: number): ElasticSearchQueryBuilder;
    selectFields(fields: string[]): ElasticSearchQueryBuilder;
}
