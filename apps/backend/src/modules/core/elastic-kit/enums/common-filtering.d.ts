export declare enum FilterFieldTypeEnum {
    Parent = "parent",
    String = "string",
    Number = "number",
    Object = "object",
    Nested = "nested",
    Child = "child"
}
export declare enum StringFieldConditionEnum {
    Is = "is",
    IsNot = "isNot",
    StartsWith = "startsWith",
    EndsWith = "endsWith",
    Contains = "contains",
    DoesNotContain = "doesNotContain"
}
export declare enum NumberFieldConditionEnum {
    Is = "is",
    IsNot = "isNot",
    GreaterThan = "greaterThan",
    LessThan = "lessThan"
}
export declare enum NestedFieldConditionEnum {
    Is = "is",
    IsNot = "isNot"
}
export declare enum ObjectFieldConditionEnum {
    In = "in",
    Is = "is",
    Or = "or",
    And = "and"
}
export declare type FilterFieldCondition = StringFieldConditionEnum | NumberFieldConditionEnum | NestedFieldConditionEnum | ObjectFieldConditionEnum;
