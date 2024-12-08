import { ElasticSearchExpressionDto } from '../dto';
import { ElasticSearchExpressionsEnum } from '../enums';
export declare class ExpressionsFactory {
    static getExpression(field: string, value: any, conditionName: ElasticSearchExpressionsEnum): ElasticSearchExpressionDto;
}
