import { ElasticSearchExpressionDto } from '../../dto';
export declare class ParentExpression {
    static getName(): string;
    static getExpression(field: string, value: any): ElasticSearchExpressionDto;
}
