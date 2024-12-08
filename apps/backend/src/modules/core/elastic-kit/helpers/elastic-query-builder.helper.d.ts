import { ElasticSearchQueryBuilder } from '../query-builder';
import { CommonFilterInterface } from '../interfaces';
export declare class ElasticProductsQueryBuilderHelper {
    static createBuilder(filters: CommonFilterInterface[], strict?: boolean): ElasticSearchQueryBuilder;
    private static buildFieldQuery;
    private static buildScalarExpression;
    private static buildExpressionsForMultipleValues;
    private static buildNestedFieldQuery;
    private static buildChildFieldQuery;
    private static buildParentFieldQuery;
    private static escapeRegExp;
    private static getExpressionType;
    private static groupFiltersInQueryBuilder;
}
