"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartsWithExpression = void 0;
const enums_1 = require("../../enums");
class StartsWithExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.StartsWith;
    }
    static getExpression(field, value) {
        return {
            query_string: {
                fields: [`${field}^1`],
                query: `${value}*`,
            },
        };
    }
}
exports.StartsWithExpression = StartsWithExpression;
