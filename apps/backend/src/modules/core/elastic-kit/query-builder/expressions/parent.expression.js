"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParentExpression = void 0;
const __1 = require("../");
const enums_1 = require("../../enums");
class ParentExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.Parent;
    }
    static getExpression(field, value) {
        const queryBuilder = new __1.ElasticSearchQueryBuilder();
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
exports.ParentExpression = ParentExpression;
