import { Operator } from "Operator";
import { isAfter, isBefore, isSameOrAfter, isSameOrBefore } from "../../dates/Date";

export const operators: Operator = {
    // tslint:disable-next-line:triple-equals
    "!=": (x: any, y: any) => x != y,
    "!==": (x: any, y: any) => x !== y,
    "<": (x: any, y: any) => x < y,
    "<=": (x: any, y: any) => x <= y,
    // tslint:disable-next-line:triple-equals
    "==": (x: any, y: any) => x == y,
    "===": (x: any, y: any) => x === y,
    ">": (x: any, y: any) => x > y,
    ">=": (x: any, y: any) => x >= y,
    isAfter,
    isBefore,
    isSameOrAfter,
    isSameOrBefore,
    like: (x: any, y: any) => {
        const str: string = x.toString();
        return !!str.match(new RegExp(`.*${y.toString()}.*`, "gi"));
    },
};

export const executeByOperator = (x: any, operator: string, y: any) => operators[operator](x, y);

export default { executeByOperator, operators };
