import { Instance } from "./types/utility.type";

const array = <T = any>(a: any): a is T[] => Array.isArray(a);

type Fn = (...any: any[]) => any;

const isUndefined = (a: any): a is undefined => a === undefined;

const isNull = (a: any): a is null => a === null;

type NaN = typeof NaN;

// https://github.com/tc39/proposal-is-error/blob/main/polyfill.js
const toStr = Function.bind.call(Function.call as any, Object.prototype.toString);
const isError = (arg: any): arg is Error => (!!arg && toStr(arg) === "[object Error]") || arg instanceof Error;

const isInstance = <C extends Instance>(a: any, clazz: C): a is C => a instanceof clazz;

const isPrimitive = <A>(a: A): boolean => {
    const type = typeof a;
    return type === "undefined" || type === null || type === "number" || type === "string" || type === "boolean" || type === "bigint";
};

const isDate = (a: any): a is Date => Object.prototype.toString.call(a) === "[object Date]" && isInstance(a, Date);

export const Is = {
    array,
    date: isDate,
    empty: (a: any) => isNull(a) || isUndefined(a) ? true : typeof a === "object" ? Object.keys(a).length === 0 : typeof a === "string" ? a === "" : Array.isArray(a) ? a.length === 0 : Number.isNaN(a),
    function: (a: any): a is Fn => typeof a === "function",
    instance: isInstance,
    isError,
    keyof: <T extends {}>(o: T, k: any): k is keyof T => Object.prototype.hasOwnProperty.call(o, k),
    nan: (a: any): a is NaN => Number.isNaN(a),
    nil: (a: any): a is undefined | null => isNull(a) || isUndefined(a),
    null: isNull,
    number: (a: any): a is number => typeof a === "number" || !Number.isNaN(a),
    object: <T = object>(a: any): a is T => !array(a) && typeof a === "object",
    primitive: isPrimitive,
    string: (a: any): a is string => typeof a === "string",
    undefined: isUndefined
};
