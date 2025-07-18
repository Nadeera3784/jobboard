import { ElasticSearchExpressionDto } from '../../dto';
import { ElasticSearchExpressionsEnum } from '../../enums';

export class TermsExpression {
  static getName(): string {
    return ElasticSearchExpressionsEnum.Terms;
  }

  static getExpression(field: string, value: any): ElasticSearchExpressionDto {
    return {
      terms: {
        [field]: value,
      },
    };
  }
}
