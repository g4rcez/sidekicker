import { Operator } from "../../types/Operator";

export const operators: Operator = {
    like: (x: any, y: any): Boolean => {
        const str: string = x.toString();
        return !!str.match(new RegExp(`.*${y.toString()}.*`, "gi"));
    },
    "==": (x: any, y: any): Boolean => x == y,
    ">": (x: any, y: any): Boolean => x > y,
    ">=": (x: any, y: any): Boolean => x >= y,
    "<": (x: any, y: any): Boolean => x < y,
    "<=": (x: any, y: any): Boolean => x <= y,
    "!=": (x: any, y: any): Boolean => x != y,
    "!==": (x: any, y: any): Boolean => x !== y,
    "===": (x: any, y: any): Boolean => x === y,
};

export const executeByOperator = (x: any, operator: string, y: any) => operators[operator](x, y);

export default { executeByOperator, operators };
