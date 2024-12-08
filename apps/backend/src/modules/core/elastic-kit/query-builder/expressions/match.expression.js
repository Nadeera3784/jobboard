"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchExpression = void 0;
const enums_1 = require("../../enums");
class MatchExpression {
    static getName() {
        return enums_1.ElasticSearchExpressionsEnum.Match;
    }
    static getExpression(field, value) {
        return {
            match_phrase: {
                [field]: value,
            },
        };
    }
}
exports.MatchExpression = MatchExpression;
