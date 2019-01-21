export type WhereOperator = {
    key: string;
    operator?:
        | "!="
        | "!=="
        | "<"
        | "<="
        | "=="
        | "==="
        | ">"
        | ">="
        | "isAfter"
        | "isBefore"
        | "like"
        | "isSameOrAfter"
        | "isSameOrBefore";
    value: any;
};
