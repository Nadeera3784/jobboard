import { ElasticSearchExpressionDto } from '../../dto';
export declare class LessThanExpression {
    static getName(): string;
    static getExpression(field: string, value: any): ElasticSearchExpressionDto;
}
