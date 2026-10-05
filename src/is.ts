import type { Instance } from "./types/utility.type";

export const array = <T = any>(a: any): a is T[] => Array.isArray(a);

type Fn = (...any: any[]) => any;

export const isUndefined = (a: any): a is undefined => a === undefined;

export const isNull = (a: any): a is null => a === null;

type NaNType = typeof NaN;

// https://github.com/tc39/proposal-is-error/blob/main/polyfill.js
export const isError = (arg: unknown): arg is Error =>
    (!!arg && Object.prototype.toString.call(arg) === "[object Error]") || arg instanceof Error;

export const isInstance = <C extends Instance>(a: any, clazz: C): a is C => a instanceof clazz;

export const isPrimitive = <A>(a: A): boolean => {
    const type = typeof a;
    return (
        a === null ||
        type === "undefined" ||
        type === "number" ||
        type === "string" ||
        type === "boolean" ||
        type === "bigint" ||
        type === "symbol"
    );
};

export const isDate = (a: any): a is Date =>
    Object.prototype.toString.call(a) === "[object Date]" && isInstance(a, Date);

export const Is = {
    array,
    date: isDate,
    empty: (a: any) => {
        if (isNull(a) || isUndefined(a)) return true;
        if (typeof a === "string") return a === "";
        if (Array.isArray(a)) return a.length === 0;
        if (typeof a === "object") return Object.keys(a).length === 0;
        return Number.isNaN(a);
    },
    function: (a: any): a is Fn => typeof a === "function",
    instance: isInstance,
    isError,
    keyof: <T extends {}>(o: T, k: keyof T | string): k is keyof T => Object.prototype.hasOwnProperty.call(o, k),
    nan: (a: any): a is NaNType => Number.isNaN(a),
    nil: (a: any): a is undefined | null => isNull(a) || isUndefined(a),
    null: isNull,
    number: (a: any): a is number => {
        if (typeof a === "number") {
            return !Number.isNaN(a);
        }
        return false;
    },
    object: <T = object>(a: any): a is T => a !== null && !array(a) && typeof a === "object",
    primitive: isPrimitive,
    string: (a: any): a is string => typeof a === "string",
    undefined: isUndefined,
};
