import { ElasticSearchExpressionDto } from '../../dto';
export declare class StartsWithExpression {
    static getName(): string;
    static getExpression(field: string, value: any): ElasticSearchExpressionDto;
}
