import { ElasticSearchExpressionDto } from '../dto';
import { ElasticSearchExpressionsEnum } from '../enums';
import { Expressions } from './expressions';

export class ExpressionsFactory {
  static getExpression(
    field: string,
    value: any,
    conditionName: ElasticSearchExpressionsEnum,
  ): ElasticSearchExpressionDto {
    for (const condition of Expressions) {
      if (conditionName === condition.getName()) {
        return condition.getExpression(field, value);
      }
    }

    // Adding return type for type safety
    return {} as ElasticSearchExpressionDto;
  }
}
