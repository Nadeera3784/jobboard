import { ElasticSearchExpressionDto } from '../../dto';
import { ElasticSearchExpressionsEnum } from '../../enums';
import { ElasticSearchQueryBuilder } from '..';

export class ChildExpression {
    static getName(): string {
        return ElasticSearchExpressionsEnum.Child;
    }

    static getExpression(field: string, value: any[]): ElasticSearchExpressionDto {
        const queryBuilder = new ElasticSearchQueryBuilder();
        
        for (const condition of value) {
            queryBuilder.must(condition);
        }
        
        return {
            has_child: {
                query: queryBuilder.getQuery(),
                type: field,
            },
        };
    }
}