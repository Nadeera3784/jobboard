import { ElasticSearchExpressionDto } from '../../dto';
import { ElasticSearchExpressionsEnum } from '../../enums';
import { ElasticSearchQueryBuilder } from '..';

export class NestedExpression {
    static getName(): string {
        return ElasticSearchExpressionsEnum.Nested;
    }

    static getExpression(field: string, value: any[]): ElasticSearchExpressionDto {
        const queryBuilder = new ElasticSearchQueryBuilder();
        
        for (const condition of value) {
            if (Array.isArray(condition)) {
                queryBuilder.must({
                    bool: {
                        must: [],
                        must_not: [],
                        should: condition,
                    },
                });
            } else {
                queryBuilder.must(condition);
            }
        }
        
        return {
            nested: {
                path: field,
                query: queryBuilder.getQuery(),
            },
        };
    }
}