import { ElasticSearchExpressionDto } from '../../dto';
export declare class GreaterThanExpression {
    static getName(): string;
    static getExpression(field: string, value: any): ElasticSearchExpressionDto;
}
