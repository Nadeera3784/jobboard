"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TermsExpression = void 0;
const enums_1 = require("../../enums");
class TermsExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.Terms;
    }
    static getExpression(field, value) {
        return {
            terms: {
                [field]: value,
            },
        };
    }
}
exports.TermsExpression = TermsExpression;
