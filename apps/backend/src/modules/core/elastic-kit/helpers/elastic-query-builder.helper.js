"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticProductsQueryBuilderHelper = void 0;
const enums_1 = require("../enums");
const query_builder_1 = require("../query-builder");
const expand_filter_helper_1 = require("./expand-filter.helper");
const common_filtering_1 = require("../enums/common-filtering");
class ElasticProductsQueryBuilderHelper {
    static createBuilder(filters, strict = true) {
        const queryBuilder = new query_builder_1.ElasticSearchQueryBuilder();
        if (!filters) {
            return queryBuilder;
        }
        for (const filter of filters) {
            const fieldQuery = this.buildFieldQuery(filter);
            switch (filter.fieldCondition) {
                case common_filtering_1.StringFieldConditionEnum.Is:
                case common_filtering_1.StringFieldConditionEnum.Contains:
                case common_filtering_1.StringFieldConditionEnum.StartsWith:
                case common_filtering_1.StringFieldConditionEnum.EndsWith:
                case common_filtering_1.NestedFieldConditionEnum.Is:
                    if (strict) {
                        queryBuilder.must(fieldQuery);
                    }
                    else {
                        queryBuilder.should(fieldQuery);
                    }
                    break;
                case common_filtering_1.StringFieldConditionEnum.IsNot:
                case common_filtering_1.StringFieldConditionEnum.DoesNotContain:
                case common_filtering_1.NumberFieldConditionEnum.IsNot:
                case common_filtering_1.NestedFieldConditionEnum.IsNot:
                    if (strict) {
                        queryBuilder.mustNot(fieldQuery);
                    }
                    else {
                        queryBuilder.shouldNot(fieldQuery);
                    }
            }
        }
        return strict ? queryBuilder : this.groupFiltersInQueryBuilder(queryBuilder);
    }
    static buildFieldQuery(filter, path = null) {
        if (!path) {
            filter = expand_filter_helper_1.ExpandFilterHelper.expandChildFilter(filter);
        }
        switch (filter.fieldType) {
            case common_filtering_1.FilterFieldTypeEnum.Number:
            case common_filtering_1.FilterFieldTypeEnum.String:
                return this.buildScalarExpression(filter, filter.field);
            case common_filtering_1.FilterFieldTypeEnum.Nested:
                return ElasticProductsQueryBuilderHelper.buildNestedFieldQuery(filter.filters, filter.field);
            case common_filtering_1.FilterFieldTypeEnum.Child:
                return ElasticProductsQueryBuilderHelper.buildChildFieldQuery(filter.filters, filter.field);
            case common_filtering_1.FilterFieldTypeEnum.Parent:
                return ElasticProductsQueryBuilderHelper.buildParentFieldQuery(filter.filters, filter.field);
        }
    }
    static buildScalarExpression(filter, fieldName) {
        if (filter && filter.valueIn) {
            return query_builder_1.ExpressionsFactory.getExpression(fieldName, filter.valueIn.map((value) => this.escapeRegExp(value)), this.getExpressionType(filter.fieldCondition, true));
        }
        return query_builder_1.ExpressionsFactory.getExpression(fieldName, this.escapeRegExp(filter.value), this.getExpressionType(filter.fieldCondition));
    }
    static buildExpressionsForMultipleValues(field, value, path = null) {
        const conditions = [];
        for (const filterValue of value) {
            const fieldConditions = Array.isArray(filterValue)
                ? this.buildExpressionsForMultipleValues(field, value, path)
                : this.buildFieldQuery(filterValue, path);
            conditions.push(fieldConditions);
        }
        return conditions;
    }
    static buildNestedFieldQuery(value, field) {
        const conditions = this.buildExpressionsForMultipleValues(field, value, field);
        return query_builder_1.ExpressionsFactory.getExpression(field, conditions, enums_1.ElasticSearchExpressionsEnum.Nested);
    }
    static buildChildFieldQuery(value, fieldName) {
        const conditions = this.buildExpressionsForMultipleValues(fieldName, value);
        return query_builder_1.ExpressionsFactory.getExpression(fieldName, conditions, enums_1.ElasticSearchExpressionsEnum.Child);
    }
    static buildParentFieldQuery(value, fieldName) {
        const conditions = this.buildExpressionsForMultipleValues(fieldName, value);
        return query_builder_1.ExpressionsFactory.getExpression(fieldName, conditions, enums_1.ElasticSearchExpressionsEnum.Parent);
    }
    static escapeRegExp(input) {
        input = input || '';
        return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    static getExpressionType(condition, isArray = false) {
        switch (condition) {
            case common_filtering_1.NumberFieldConditionEnum.Is:
            case common_filtering_1.NumberFieldConditionEnum.IsNot:
            case common_filtering_1.StringFieldConditionEnum.Is:
            case common_filtering_1.StringFieldConditionEnum.IsNot:
                if (isArray) {
                    return enums_1.ElasticSearchExpressionsEnum.Terms;
                }
                return enums_1.ElasticSearchExpressionsEnum.Match;
            case common_filtering_1.NumberFieldConditionEnum.LessThan:
                return enums_1.ElasticSearchExpressionsEnum.LessThan;
            case common_filtering_1.NumberFieldConditionEnum.GreaterThan:
                return enums_1.ElasticSearchExpressionsEnum.GreaterThan;
            case common_filtering_1.StringFieldConditionEnum.Contains:
            case common_filtering_1.StringFieldConditionEnum.DoesNotContain:
                return enums_1.ElasticSearchExpressionsEnum.Contains;
            case common_filtering_1.StringFieldConditionEnum.StartsWith:
                return enums_1.ElasticSearchExpressionsEnum.StartsWith;
            case common_filtering_1.StringFieldConditionEnum.EndsWith:
                return enums_1.ElasticSearchExpressionsEnum.EndsWith;
        }
        return null;
    }
    static groupFiltersInQueryBuilder(queryBuilder) {
        const result = new query_builder_1.ElasticSearchQueryBuilder();
        result.must(queryBuilder.getQuery());
        return result;
    }
}
exports.ElasticProductsQueryBuilderHelper = ElasticProductsQueryBuilderHelper;
