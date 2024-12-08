import { ElasticSearchExpressionDto } from '../../dto';
export declare class MatchExpression {
    static getName(): string;
    static getExpression(field: string, value: any): ElasticSearchExpressionDto;
}
