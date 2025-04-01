import { ElasticSearchExpressionDto } from '../../dto';
import { ElasticSearchExpressionsEnum } from '../../enums';

export class MatchExpression {
    static getName(): string {
        return ElasticSearchExpressionsEnum.Match;
    }

    static getExpression(field: string, value: any): ElasticSearchExpressionDto {
        return {
            match_phrase: {
                [field]: value,
            },
        };
    }
}