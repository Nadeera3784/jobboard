"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndsWithExpression = void 0;
const enums_1 = require("../../enums");
class EndsWithExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.EndsWith;
    }
    static getExpression(field, value) {
        return {
            query_string: {
                fields: [`${field}^1`],
                query: `*${value}`,
            },
        };
    }
}
exports.EndsWithExpression = EndsWithExpression;
