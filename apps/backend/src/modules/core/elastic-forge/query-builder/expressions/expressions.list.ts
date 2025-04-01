import { ContainsExpression } from './contains.expression';
import { EndsWithExpression } from './ends-with.expression';
import { GreaterThanExpression } from './greater-than.expression';
import { LessThanExpression } from './less-than.expression';
import { MatchExpression } from './match.expression';
import { StartsWithExpression } from './starts-with.expression';
import { NestedExpression } from './nested.expression';
import { ChildExpression } from './child.expression';
import { ParentExpression } from './parent.expression';
import { TermsExpression } from './terms.expression';

// Define a common type for expressions
type ExpressionClass = {
    getName(): string;
    getExpression(field: string, value: any): any;
};

export const Expressions: ExpressionClass[] = [
    ContainsExpression,
    EndsWithExpression,
    GreaterThanExpression,
    LessThanExpression,
    MatchExpression,
    TermsExpression,
    StartsWithExpression,
    NestedExpression,
    ChildExpression,
    ParentExpression,
];