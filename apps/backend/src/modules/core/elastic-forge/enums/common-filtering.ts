export enum FilterFieldTypeEnum {
    Parent = "parent",
    String = "string",
    Number = "number",
    Object = "object",
    Nested = "nested",
    Child = "child"
}

export enum StringFieldConditionEnum {
    Is = "is",
    IsNot = "isNot",
    StartsWith = "startsWith",
    EndsWith = "endsWith",
    Contains = "contains",
    DoesNotContain = "doesNotContain"
}

export enum NumberFieldConditionEnum {
    Is = "is",
    IsNot = "isNot",
    GreaterThan = "greaterThan",
    LessThan = "lessThan"
}

export enum NestedFieldConditionEnum {
    Is = "is",
    IsNot = "isNot"
}

export enum ObjectFieldConditionEnum {
    In = "in",
    Is = "is",
    Or = "or",
    And = "and"
}

export type FilterFieldCondition = 
    StringFieldConditionEnum | 
    NumberFieldConditionEnum | 
    NestedFieldConditionEnum | 
    ObjectFieldConditionEnum;