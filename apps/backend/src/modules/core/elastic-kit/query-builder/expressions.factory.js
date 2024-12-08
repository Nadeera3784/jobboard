"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionsFactory = void 0;
const expressions_1 = require("./expressions");
class ExpressionsFactory {
    static getExpression(field, value, conditionName) {
        for (const condition of expressions_1.Expressions) {
            if (conditionName === condition.getName()) {
                return condition.getExpression(field, value);
            }
        }
    }
}
exports.ExpressionsFactory = ExpressionsFactory;
