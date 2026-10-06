import { Is } from "./is";
import type { AllPaths } from "./types/all-paths.type";

const setHelper = (obj: object, path: Array<string | number>, value: unknown): object => {
    const current = String(path[0] ?? "undefined");
    const rest = path.slice(1);
    if (rest.length === 0) {
        Reflect.set(obj, current, value);
        return obj;
    }
    const next = rest[0];
    const isArray = typeof next === "number" || `${Number(next)}` === String(next);
    let child = Reflect.get(obj, current);
    if (!child) {
        child = isArray ? [] : {};
        Reflect.set(obj, current, child);
    }
    if (typeof child !== "object" || child === null) child = isArray ? [] : {};
    Reflect.set(obj, current, setHelper(child, rest, value));
    return obj;
};

export const has = <T extends {}, K extends keyof T>(o: T, k: K): k is K => Reflect.has(o, k);

export const keys = <T extends {}>(t: T) => Object.keys(t) as Array<keyof T>;
const normalizedKey = (key: PropertyKey) => (typeof key === "number" ? String(key) : key);

const copyOwnProperty = (target: Record<PropertyKey, unknown>, key: PropertyKey, value: unknown) => {
    if (key === "__proto__") {
        Object.defineProperty(target, key, { configurable: true, enumerable: true, value, writable: true });
        return;
    }
    target[key] = value;
};

export const pick = <T extends object, K extends keyof T>(object: T, selectedKeys: readonly K[]): Pick<T, K> => {
    const result: Record<PropertyKey, unknown> = {};
    for (let index = 0; index < selectedKeys.length; index++) {
        const key = normalizedKey(selectedKeys[index] as PropertyKey);
        if (!Object.prototype.propertyIsEnumerable.call(object, key)) continue;
        copyOwnProperty(result, key, Reflect.get(object, key));
    }
    return result as Pick<T, K>;
};

export const omit = <T extends object, K extends keyof T>(object: T, omittedKeys: readonly K[]): Omit<T, K> => {
    const omitted = new Set<PropertyKey>();
    for (let index = 0; index < omittedKeys.length; index++) {
        omitted.add(normalizedKey(omittedKeys[index] as PropertyKey));
    }

    const result: Record<PropertyKey, unknown> = {};
    for (const key of Reflect.ownKeys(object)) {
        if (omitted.has(key) || !Object.prototype.propertyIsEnumerable.call(object, key)) continue;
        copyOwnProperty(result, key, Reflect.get(object, key));
    }
    return result as Omit<T, K>;
};

export const getPath = <T extends any>(obj: T, path: string | string[], defValue?: any) => {
    if (!path) return undefined;
    const pathArray: any = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
    let result: any = obj;
    const length = pathArray.length;
    for (let index = 0; index < length; index++) {
        if (index in pathArray) {
            const key = pathArray[index];
            result = result && result[key];
        }
    }
    return result === undefined ? defValue : result;
};

export const equals = (a: any, b: any): boolean => {
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

export const diff = <T extends any, Keys extends AllPaths<T>[]>(a: T, b: T, keys: Keys) =>
    keys.some((x) => !equals(getPath(a, x), getPath(b, x)));

export const convertPath = (path: string) => (path as string).replace("[", ".").replace("]", "").split(".");

export const setPath = <O extends object>(o: O, path: AllPaths<O> | Array<string | number> | string, value: any) => {
    const pathArr = Array.isArray(path) ? path : convertPath(path);
    const obj = structuredClone(o);
    setHelper(obj, pathArr, value);
    return obj;
};

export const deepMerge = <Defaults extends object, Settings extends object>(
    defaults: Defaults,
    settings: Settings,
): Settings & Defaults => {
    Object.keys(defaults).forEach((key) => {
        const defaultValue = Reflect.get(defaults, key);
        const value = Reflect.get(settings, key);
        if (Is.undefined(value)) {
            Reflect.set(settings, key, defaultValue);
        } else if (Is.object(value) && Is.object(defaultValue)) {
            deepMerge(defaultValue, value);
        }
    });
    return settings as Settings & Defaults;
};

export const merge = <A extends any, B extends any = A>(target: A, source: B): A & B => {
    const output = Object.assign({}, target);
    if (Is.object(target) && Is.object(source)) {
        keys(source).forEach((key) => {
            const sourceValue = source[key];
            if (Is.object(sourceValue)) {
                const targetValue = Reflect.get(target, key);
                const base = Is.object(targetValue) ? targetValue : {};
                Reflect.set(output, key, merge(base, sourceValue));
            } else {
                Reflect.set(output, key, sourceValue);
            }
        });
    }
    return output as A & B;
};

export const Objects = { has, merge, keys, pick, omit, get: getPath, diff, set: setPath, convertPath };
