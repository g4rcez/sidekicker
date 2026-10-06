export const chunk = <T>(array: T[], size: number): T[][] => {
    if (!Number.isSafeInteger(size) || size <= 0) throw new RangeError("Chunk size must be a positive integer");

    const chunks: T[][] = [];
    let current: T[] = [];
    for (const item of array) {
        current.push(item);
        if (current.length === size) {
            chunks.push(current);
            current = [];
        }
    }
    if (current.length > 0) chunks.push(current);
    return chunks;
};
export const partition = <T>(iterable: Iterable<T>, predicate: (item: T, index: number) => boolean): [T[], T[]] => {
    const matching: T[] = [];
    const nonMatching: T[] = [];
    let index = 0;
    for (const item of iterable) {
        const target = predicate(item, index++) ? matching : nonMatching;
        target.push(item);
    }
    return [matching, nonMatching];
};

export const dict = <T, K extends keyof T>(array: T[], key: K): Record<string, T> => {
    const entries = new Map<PropertyKey, T>();
    for (const item of array) entries.set(item[key] as unknown as PropertyKey, item);
    return Object.fromEntries(entries) as Record<string, T>;
};

export const distinct = <T>(array: T[]): T[] => {
    const uniqueValues: T[] = [];
    const seen = new Set<T>();
    for (const item of array) {
        if (seen.has(item)) continue;
        seen.add(item);
        uniqueValues.push(item);
    }
    return uniqueValues;
};

type NumericKey<T> = { [K in keyof T]-?: T[K] extends number ? K : never }[keyof T];
type NumberSelector<T> = NumericKey<T> | ((item: T, index: number) => number) | undefined;

const numericValue = <T>(item: T, selector: NumberSelector<T>, index: number): number => {
    if (selector === undefined) return item as unknown as number;
    if (typeof selector === "function") return selector(item, index);
    return item[selector] as unknown as number;
};

export function max(array: number[]): number;
export function max<T>(array: T[], selector: NumericKey<T> | ((item: T, index: number) => number)): number;
export function max<T>(array: T[], selector?: NumberSelector<T>): number {
    let found = false;
    let maximum = 0;
    let index = 0;
    for (const item of array) {
        const value = numericValue(item, selector, index++);
        if (!found || value > maximum) {
            maximum = value;
            found = true;
        }
    }
    if (!found) throw new RangeError("Sequence contains no elements");
    return maximum;
}

export function min(array: number[]): number;
export function min<T>(array: T[], selector: NumericKey<T> | ((item: T, index: number) => number)): number;
export function min<T>(array: T[], selector?: NumberSelector<T>): number {
    let found = false;
    let minimum = 0;
    let index = 0;
    for (const item of array) {
        const value = numericValue(item, selector, index++);
        if (!found || value < minimum) {
            minimum = value;
            found = true;
        }
    }
    if (!found) throw new RangeError("Sequence contains no elements");
    return minimum;
}

export function sum(array: number[]): number;
export function sum<T>(array: T[], selector: NumericKey<T> | ((item: T, index: number) => number)): number;
export function sum<T>(array: T[], selector?: NumberSelector<T>): number {
    let total = 0;
    let index = 0;
    for (const item of array) total += numericValue(item, selector, index++);
    return total;
}

export function diff(array: number[]): number;
export function diff<T>(array: T[], selector: NumericKey<T> | ((item: T, index: number) => number)): number;
export function diff<T>(array: T[], selector?: NumberSelector<T>): number {
    let difference = 0;
    let index = 0;
    for (const item of array) difference -= numericValue(item, selector, index++);
    return difference;
}

const isNumericString = (value: string) => /[0-9.]+/.test(value);
const isNumberOrString = (value: unknown): value is number | string =>
    typeof value === "number" || typeof value === "string";

const getInSequence = (first: string, second: string): [number, number] => {
    const left = Number.parseInt(first, 10);
    const right = Number.parseInt(second, 10);
    return left > right ? [right, left] : [left, right];
};

const individualChars = (first: string, last: string, jumps = 1): (number | string)[] => {
    const numeric = isNumericString(first) && isNumericString(last);
    const values: (number | string)[] = [];
    const end = last.charCodeAt(0);
    for (let code = first.charCodeAt(0); code <= end; code += jumps) {
        const character = String.fromCharCode(code);
        values.push(numeric ? Number.parseInt(character, 10) : character);
    }
    return values;
};

const createChars = (first: string, last: string, jumps = 1): (number | string)[] => {
    const step = Math.abs(jumps);
    if (first.length > 1 || last.length > 1) {
        if (isNumericString(first) && isNumericString(last)) {
            const [start, end] = getInSequence(first, last);
            const values: number[] = [];
            for (let value = start; value <= end; value += step) values.push(value);
            return values;
        }
    }
    return individualChars(first, last, step);
};

export const range = <T extends number | string>(firstOrLength: T, secondOrSteps?: number | string, jumps = 1): T[] => {
    if (secondOrSteps === undefined) {
        const [first, second, last] = String(firstOrLength).split("..") as [string, string, string?];
        if (last === undefined) return createChars(first, second, 1) as T[];
        return createChars(first, last, Number.parseInt(second, 10)) as T[];
    }
    if (isNumberOrString(firstOrLength) && isNumberOrString(secondOrSteps)) {
        return createChars(`${firstOrLength}`, `${secondOrSteps}`, jumps) as T[];
    }
    return Array.from(
        { length: firstOrLength as number },
        (_, index) => index * Math.abs(secondOrSteps as number),
    ) as T[];
};

export type SortParameters<T> = ((left: T, right: T) => number) | undefined | keyof T;

export enum Order {
    Asc = "asc",
    Desc = "desc",
}

export type Sorter<T> = { key: keyof T; type: Order };

const compareByKey =
    <T>(key: keyof T) =>
    (left: T, right: T) => {
        const leftValue = Reflect.get(left as object, key as PropertyKey);
        const rightValue = Reflect.get(right as object, key as PropertyKey);
        if (leftValue === rightValue) return 0;
        return leftValue > rightValue ? 1 : -1;
    };

export const sort = <T>(array: T[], sorter?: SortParameters<T>): T[] => {
    const sorted = [...array];
    // oxlint-disable-next-line typescript/require-array-sort-compare -- Preserve native string ordering without per-comparison conversion.
    if (sorter === undefined) return sorted.sort();
    if (typeof sorter === "function") return sorted.sort(sorter);
    return sorted.sort(compareByKey(sorter));
};

const createSorter =
    <T>(fields: Sorter<T>[]) =>
    (left: T, right: T) => {
        for (const field of fields) {
            const direction = field.type === Order.Desc ? -1 : 1;
            const first = Reflect.get(left as object, field.key as PropertyKey);
            const second = Reflect.get(right as object, field.key as PropertyKey);
            const comparison = first > second ? direction : first < second ? -direction : 0;
            if (comparison !== 0) return comparison;
        }
        return 0;
    };

export const multiSort = <T>(array: T[], fields: Sorter<T>[]): T[] => array.sort(createSorter(fields));
