import { Is } from "./is";
import { AllPaths } from "./types/all-paths.type";

const setHelper = (obj: any, path: string[], value: any) => {
    const [current, ...rest] = path;
    if (rest.length > 0) {
        if (!obj[current]) {
            const isNumber = `${+rest[0]}` === rest[0];
            obj[current] = isNumber ? [] : {};
        }
        if (typeof obj[current] !== "object") {
            const isNumber = `${+rest[0]}` === rest[0];
            obj[current] = setHelper(isNumber ? [] : {}, rest, value);
        } else obj[current] = setHelper(obj[current], rest, value);
    } else obj[current] = value;
    return obj;
};

export const has = <T extends {}, K extends keyof T>(o: T, k: K): k is K => Reflect.has(o, k);

export const keys = <T extends {}>(t: T) => Object.keys(t) as Array<keyof T>;

export const getPath = <T extends any>(obj: T, path: string | string[], defValue?: any) => {
    if (!path) return undefined;
    const pathArray: any = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
    const result = pathArray.reduce((prevObj: any, key: any) => prevObj && prevObj[key], obj);
    return result === undefined ? defValue : result;
};

const equals = (a: any, b: any): boolean => {
    if (a === b) {
        return true;
    }
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    if (!a || !b || (!Is.object(a) && !Is.object(b))) {
        return a === b;
    }
    if (a.prototype !== b.prototype) {
        return false;
    }
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) {
        return false;
    }
    return keys.every((k) => equals(a[k], b[k]));
};

export const diff = <T extends any, Keys extends AllPaths<T>[]>(a: T, b: T, keys: Keys) => keys.some((x) => !equals(getPath(a, x), getPath(b, x)));

export const convertPath = (path: string) => (path as string).replace("[", ".").replace("]", "").split(".");

export const setPath = <O extends object>(o: O, path: AllPaths<O> | Array<string | number> | string, value: any) => {
    const pathArr = Array.isArray(path) ? path : convertPath(path);
    const obj = structuredClone(o);
    setHelper(obj, pathArr as string[], value);
    return obj;
};

export const deepMerge = <T extends object>(defaults: T, settings: T) => {
    Object.keys(defaults).forEach(key => {
        const value = (settings as any)[key];
        if (Is.undefined(value)) {
            (settings as any)[key] = value;
        } else if (Is.object(value) && Is.object(value)) {
            deepMerge(value, value);
        }
    });
    return settings;
};

export const Objects = { has, keys, get: getPath, diff, set: setPath, convertPath };