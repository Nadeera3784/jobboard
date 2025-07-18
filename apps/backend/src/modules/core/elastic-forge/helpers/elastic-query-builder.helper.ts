import { ElasticSearchExpressionsEnum } from '../enums';
import {
  ElasticSearchQueryBuilder,
  ExpressionsFactory,
} from '../query-builder';
import { ExpandFilterHelper } from './expand-filter.helper';
import {
  FilterFieldTypeEnum,
  StringFieldConditionEnum,
  NumberFieldConditionEnum,
  NestedFieldConditionEnum,
  FilterFieldCondition,
} from '../enums/common-filtering';
import { CommonFilterInterface } from '../interfaces';

export class ElasticProductsQueryBuilderHelper {
  static createBuilder(
    filters: CommonFilterInterface[],
    strict = true,
  ): ElasticSearchQueryBuilder {
    const queryBuilder = new ElasticSearchQueryBuilder();

    if (!filters) {
      return queryBuilder;
    }

    for (const filter of filters) {
      const fieldQuery = this.buildFieldQuery(filter);

      switch (filter.fieldCondition) {
        case StringFieldConditionEnum.Is:
        case StringFieldConditionEnum.Contains:
        case StringFieldConditionEnum.StartsWith:
        case StringFieldConditionEnum.EndsWith:
        case NestedFieldConditionEnum.Is:
          if (strict) {
            queryBuilder.must(fieldQuery);
          } else {
            queryBuilder.should(fieldQuery);
          }
          break;
        case StringFieldConditionEnum.IsNot:
        case StringFieldConditionEnum.DoesNotContain:
        case NumberFieldConditionEnum.IsNot:
        case NestedFieldConditionEnum.IsNot:
          if (strict) {
            queryBuilder.mustNot(fieldQuery);
          } else {
            queryBuilder.shouldNot(fieldQuery);
          }
      }
    }

    return strict
      ? queryBuilder
      : this.groupFiltersInQueryBuilder(queryBuilder);
  }

  private static buildFieldQuery(
    filter: CommonFilterInterface,
    path: string | null = null,
  ) {
    if (!path) {
      filter = ExpandFilterHelper.expandChildFilter(filter);
    }

    switch (filter.fieldType) {
      case FilterFieldTypeEnum.Number:
      case FilterFieldTypeEnum.String:
        return this.buildScalarExpression(filter, filter.field);
      case FilterFieldTypeEnum.Nested:
        return ElasticProductsQueryBuilderHelper.buildNestedFieldQuery(
          filter.filters,
          filter.field,
        );
      case FilterFieldTypeEnum.Child:
        return ElasticProductsQueryBuilderHelper.buildChildFieldQuery(
          filter.filters,
          filter.field,
        );
      case FilterFieldTypeEnum.Parent:
        return ElasticProductsQueryBuilderHelper.buildParentFieldQuery(
          filter.filters,
          filter.field,
        );
    }
  }

  private static buildScalarExpression(
    filter: CommonFilterInterface,
    fieldName: string,
  ) {
    if (filter && filter.valueIn) {
      return ExpressionsFactory.getExpression(
        fieldName,
        filter.valueIn.map((value) => this.escapeRegExp(value)),
        this.getExpressionType(filter.fieldCondition, true),
      );
    }

    return ExpressionsFactory.getExpression(
      fieldName,
      this.escapeRegExp(filter.value),
      this.getExpressionType(filter.fieldCondition),
    );
  }

  private static buildExpressionsForMultipleValues(
    field: string,
    value: any[],
    path: string | null = null,
  ) {
    const conditions = [];

    for (const filterValue of value) {
      const fieldConditions = Array.isArray(filterValue)
        ? this.buildExpressionsForMultipleValues(field, value, path)
        : this.buildFieldQuery(filterValue, path);
      conditions.push(fieldConditions);
    }

    return conditions;
  }

  private static buildNestedFieldQuery(value: any[], field: string) {
    const conditions = this.buildExpressionsForMultipleValues(
      field,
      value,
      field,
    );
    return ExpressionsFactory.getExpression(
      field,
      conditions,
      ElasticSearchExpressionsEnum.Nested,
    );
  }

  private static buildChildFieldQuery(value: any[], fieldName: string) {
    const conditions = this.buildExpressionsForMultipleValues(fieldName, value);
    return ExpressionsFactory.getExpression(
      fieldName,
      conditions,
      ElasticSearchExpressionsEnum.Child,
    );
  }

  private static buildParentFieldQuery(value: any[], fieldName: string) {
    const conditions = this.buildExpressionsForMultipleValues(fieldName, value);
    return ExpressionsFactory.getExpression(
      fieldName,
      conditions,
      ElasticSearchExpressionsEnum.Parent,
    );
  }

  private static escapeRegExp(input: string): string {
    input = input || '';
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private static getExpressionType(
    condition: FilterFieldCondition,
    isArray = false,
  ): ElasticSearchExpressionsEnum | null {
    switch (condition) {
      case NumberFieldConditionEnum.Is:
      case NumberFieldConditionEnum.IsNot:
      case StringFieldConditionEnum.Is:
      case StringFieldConditionEnum.IsNot:
        if (isArray) {
          return ElasticSearchExpressionsEnum.Terms;
        }
        return ElasticSearchExpressionsEnum.Match;
      case NumberFieldConditionEnum.LessThan:
        return ElasticSearchExpressionsEnum.LessThan;
      case NumberFieldConditionEnum.GreaterThan:
        return ElasticSearchExpressionsEnum.GreaterThan;
      case StringFieldConditionEnum.Contains:
      case StringFieldConditionEnum.DoesNotContain:
        return ElasticSearchExpressionsEnum.Contains;
      case StringFieldConditionEnum.StartsWith:
        return ElasticSearchExpressionsEnum.StartsWith;
      case StringFieldConditionEnum.EndsWith:
        return ElasticSearchExpressionsEnum.EndsWith;
    }
    return null;
  }

  private static groupFiltersInQueryBuilder(
    queryBuilder: ElasticSearchQueryBuilder,
  ): ElasticSearchQueryBuilder {
    const result = new ElasticSearchQueryBuilder();
    result.must(queryBuilder.getQuery());
    return result;
  }
}
