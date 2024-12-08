"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreaterThanExpression = void 0;
const enums_1 = require("../../enums");
class GreaterThanExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.GreaterThan;
    }
    static getExpression(field, value) {
        return {
            range: {
                [field]: {
                    gt: value,
                },
            },
        };
    }
}
exports.GreaterThanExpression = GreaterThanExpression;
