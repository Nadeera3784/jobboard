"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainsExpression = void 0;
const enums_1 = require("../../enums");
class ContainsExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.Contains;
    }
    static getExpression(field, value) {
        return {
            query_string: {
                fields: [field],
                query: `*${value}*`,
            },
        };
    }
}
exports.ContainsExpression = ContainsExpression;
