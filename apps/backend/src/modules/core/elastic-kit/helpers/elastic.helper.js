"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElasticHelper = void 0;
const class_validator_1 = require("class-validator");
class ElasticHelper {
    static escapeWildcard(term) {
        const regex = /([\+\-\=\!\(\)\{\}\[\]\^\"\~\*\?\:\/]|(\|\|)|(&&)|(\\\\))/g;
        return term.replace(regex, '\\$1').replace(/[<>]/g, '');
    }
    static generateQueryString(inputTerm, useAsterisk = true) {
        return inputTerm
            .split(' ')
            .filter((s) => !!s && s.trim())
            .map((term) => {
            if ((0, class_validator_1.isEmail)(term)) {
                return term;
            }
            const splitted = term.replace(/-/g, ' ')
                .split(' ')
                .map((s) => this.escapeWildcard(s));
            if (useAsterisk) {
                return splitted.map((s) => `*${s}*`).join(' ');
            }
            return splitted.join(' ');
        })
            .join(' ');
    }
}
exports.ElasticHelper = ElasticHelper;
