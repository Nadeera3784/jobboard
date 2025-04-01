import { ElasticSearchExpressionDto } from '../../dto';
import { ElasticSearchExpressionsEnum } from '../../enums';

export class ContainsExpression {
    static getName(): string {
        return ElasticSearchExpressionsEnum.Contains;
    }

    static getExpression(field: string, value: any): ElasticSearchExpressionDto {
        return {
            query_string: {
                fields: [field],
                query: `*${value}*`,
            },
        };
    }
}