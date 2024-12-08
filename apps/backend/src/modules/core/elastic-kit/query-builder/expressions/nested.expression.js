"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedExpression = void 0;
const enums_1 = require("../../enums");
const __1 = require("../");
class NestedExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.Nested;
    }
    static getExpression(field, value) {
        const queryBuilder = new __1.ElasticSearchQueryBuilder();
        for (const condition of value) {
            if (Array.isArray(condition)) {
                queryBuilder.must({
                    bool: {
                        must: [],
                        must_not: [],
                        should: condition,
                    },
                });
            }
            else {
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
exports.NestedExpression = NestedExpression;
