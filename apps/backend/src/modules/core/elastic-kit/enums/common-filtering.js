"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectFieldConditionEnum = exports.NestedFieldConditionEnum = exports.NumberFieldConditionEnum = exports.StringFieldConditionEnum = exports.FilterFieldTypeEnum = void 0;
var FilterFieldTypeEnum;
(function (FilterFieldTypeEnum) {
    FilterFieldTypeEnum["Parent"] = "parent";
    FilterFieldTypeEnum["String"] = "string";
    FilterFieldTypeEnum["Number"] = "number";
    FilterFieldTypeEnum["Object"] = "object";
    FilterFieldTypeEnum["Nested"] = "nested";
    FilterFieldTypeEnum["Child"] = "child";
})(FilterFieldTypeEnum = exports.FilterFieldTypeEnum || (exports.FilterFieldTypeEnum = {}));
var StringFieldConditionEnum;
(function (StringFieldConditionEnum) {
    StringFieldConditionEnum["Is"] = "is";
    StringFieldConditionEnum["IsNot"] = "isNot";
    StringFieldConditionEnum["StartsWith"] = "startsWith";
    StringFieldConditionEnum["EndsWith"] = "endsWith";
    StringFieldConditionEnum["Contains"] = "contains";
    StringFieldConditionEnum["DoesNotContain"] = "doesNotContain";
})(StringFieldConditionEnum = exports.StringFieldConditionEnum || (exports.StringFieldConditionEnum = {}));
var NumberFieldConditionEnum;
(function (NumberFieldConditionEnum) {
    NumberFieldConditionEnum["Is"] = "is";
    NumberFieldConditionEnum["IsNot"] = "isNot";
    NumberFieldConditionEnum["GreaterThan"] = "greaterThan";
    NumberFieldConditionEnum["LessThan"] = "lessThan";
})(NumberFieldConditionEnum = exports.NumberFieldConditionEnum || (exports.NumberFieldConditionEnum = {}));
var NestedFieldConditionEnum;
(function (NestedFieldConditionEnum) {
    NestedFieldConditionEnum["Is"] = "is";
    NestedFieldConditionEnum["IsNot"] = "isNot";
})(NestedFieldConditionEnum = exports.NestedFieldConditionEnum || (exports.NestedFieldConditionEnum = {}));
var ObjectFieldConditionEnum;
(function (ObjectFieldConditionEnum) {
    ObjectFieldConditionEnum["In"] = "in";
    ObjectFieldConditionEnum["Is"] = "is";
    ObjectFieldConditionEnum["Or"] = "or";
    ObjectFieldConditionEnum["And"] = "and";
})(ObjectFieldConditionEnum = exports.ObjectFieldConditionEnum || (exports.ObjectFieldConditionEnum = {}));
