"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpandFilterHelper = void 0;
const enums_1 = require("../enums");
class ExpandFilterHelper {
    static expandChildFilter(filter) {
        const splitFieldName = filter.field.split('.');
        const parentFieldName = splitFieldName.shift();
        const parentFieldType = this.getFieldType(parentFieldName);
        let newFilter;
        if (parentFieldName && parentFieldType) {
            filter.field = splitFieldName.join('.');
            newFilter = {
                field: parentFieldName,
                fieldCondition: enums_1.StringFieldConditionEnum.Is,
                fieldType: parentFieldType,
                filters: [filter],
                value: null,
            };
        }
        return newFilter || filter;
    }
    static getFieldType(fieldName) {
        if (fieldName === 'variants') {
            return enums_1.FilterFieldTypeEnum.Child;
        }
    }
}
exports.ExpandFilterHelper = ExpandFilterHelper;
