import { ElasticSearchExpressionDto } from '../../dto';
import { ElasticSearchExpressionsEnum } from '../../enums';

export class StartsWithExpression {
  static getName(): string {
    return ElasticSearchExpressionsEnum.StartsWith;
  }

  static getExpression(field: string, value: any): ElasticSearchExpressionDto {
    return {
      query_string: {
        fields: [`${field}^1`],
        query: `${value}*`,
      },
    };
  }
}
