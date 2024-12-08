"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessThanExpression = void 0;
const enums_1 = require("../../enums");
class LessThanExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.LessThan;
    }
    static getExpression(field, value) {
        return {
            range: {
                [field]: {
                    lt: value,
                },
            },
        };
    }
}
exports.LessThanExpression = LessThanExpression;
