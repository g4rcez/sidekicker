export type Operator = {
    readonly like: Function;
    readonly isAfter: Function;
    readonly isBefore: Function;
    readonly "==": Function;
    readonly "!=": Function;
    readonly "!==": Function;
    readonly "<": Function;
    readonly "<=": Function;
    readonly ">": Function;
    readonly ">=": Function;
    readonly "===": Function;
    readonly [key: string]: Function;
};
