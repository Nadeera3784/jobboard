import { ElasticSearchExpressionDto } from '../../dto';
export declare class NestedExpression {
    static getName(): string;
    static getExpression(field: string, value: any): ElasticSearchExpressionDto;
}
