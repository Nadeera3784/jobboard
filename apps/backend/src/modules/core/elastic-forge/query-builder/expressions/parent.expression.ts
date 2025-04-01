import { ElasticSearchExpressionDto } from '../../dto';
import { ElasticSearchExpressionsEnum } from '../../enums';
import { ElasticSearchQueryBuilder } from '..';

export class ParentExpression {
    static getName(): string {
        return ElasticSearchExpressionsEnum.Parent;
    }

    static getExpression(field: string, value: any[]): ElasticSearchExpressionDto {
        const queryBuilder = new ElasticSearchQueryBuilder();
        
        for (const condition of value) {
            queryBuilder.must(condition);
        }
        
        return {
            has_parent: {
                parent_type: field,
                query: queryBuilder.getQuery(),
            },
        };
    }
}