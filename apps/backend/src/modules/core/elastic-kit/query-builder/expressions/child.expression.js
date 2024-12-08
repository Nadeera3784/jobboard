"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildExpression = void 0;
const __1 = require("../");
const enums_1 = require("../../enums");
class ChildExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.Child;
    }
    static getExpression(field, value) {
        const queryBuilder = new __1.ElasticSearchQueryBuilder();
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
exports.ChildExpression = ChildExpression;
