import { ElasticSearchExpressionDto } from '../../dto';
export declare class TermsExpression {
    static getName(): string;
    static getExpression(field: string, value: any): ElasticSearchExpressionDto;
}
