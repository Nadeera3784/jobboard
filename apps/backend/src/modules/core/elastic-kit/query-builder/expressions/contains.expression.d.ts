import { ElasticSearchExpressionDto } from '../../dto';
export declare class ContainsExpression {
    static getName(): string;
    static getExpression(field: string, value: any): ElasticSearchExpressionDto;
}
