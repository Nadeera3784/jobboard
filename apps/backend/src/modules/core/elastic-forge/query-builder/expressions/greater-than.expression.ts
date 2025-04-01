import { ElasticSearchExpressionDto } from '../../dto';
import { ElasticSearchExpressionsEnum } from '../../enums';

export class GreaterThanExpression {
    static getName(): string {
        return ElasticSearchExpressionsEnum.GreaterThan;
    }

    static getExpression(field: string, value: any): ElasticSearchExpressionDto {
        return {
            range: {
                [field]: {
                    gt: value,
                },
            },
        };
    }
}