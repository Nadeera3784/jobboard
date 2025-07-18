import { ElasticSearchExpressionDto } from '../../dto';
import { ElasticSearchExpressionsEnum } from '../../enums';

export class LessThanExpression {
  static getName(): string {
    return ElasticSearchExpressionsEnum.LessThan;
  }

  static getExpression(field: string, value: any): ElasticSearchExpressionDto {
    return {
      range: {
        [field]: {
          lt: value,
        },
      },
    };
  }
}
