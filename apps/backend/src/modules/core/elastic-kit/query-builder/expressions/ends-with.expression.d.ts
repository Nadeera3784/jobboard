import { ElasticSearchExpressionDto } from '../../dto';
export declare class EndsWithExpression {
    static getName(): string;
    static getExpression(field: string, value: any): ElasticSearchExpressionDto;
}
