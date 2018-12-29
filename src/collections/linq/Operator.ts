import { Operator } from "../../types/Operator";
import { isAfter, isBefore } from "../../dates/Date";

export const operators: Operator = {
    like: (x: any, y: any) => {
        const str: string = x.toString();
        return !!str.match(new RegExp(`.*${y.toString()}.*`, "gi"));
    },
    isAfter: (x: any, y: any) => isAfter(x, y),
    isBefore: (x: any, y: any) => isBefore(x, y),
    "==": (x: any, y: any) => x == y,
    ">": (x: any, y: any) => x > y,
    ">=": (x: any, y: any) => x >= y,
    "<": (x: any, y: any) => x < y,
    "<=": (x: any, y: any) => x <= y,
    "!=": (x: any, y: any) => x != y,
    "!==": (x: any, y: any) => x !== y,
    "===": (x: any, y: any) => x === y,
};

export const executeByOperator = (x: any, operator: string, y: any) => operators[operator](x, y);

export default { executeByOperator, operators };
