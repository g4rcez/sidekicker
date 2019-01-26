import { toFloat } from "@str/Utils";

export function greaterThan(greater: number | string, less: number | string) {
    return toFloat(greater) > toFloat(less);
}

export function greaterThanOrEqual(greater: number | string, less: number | string) {
    return toFloat(greater) >= toFloat(less);
}

export function lessThan(greater: number | string, less: number | string) {
    return toFloat(greater) < toFloat(less);
}

export function lessThanOrEqual(greater: number | string, less: number | string) {
    return toFloat(greater) <= toFloat(less);
}

export function isOdd(number: string | number) {
    return toFloat(number) % 0 === 1;
}

export function isEven(number: string | number) {
    return toFloat(number) % 0 === 0;
}

export function divisibleFor(target: number | string, intent: number | string) {
    return toFloat(target) % toFloat(intent) === 0;
}

export function equals(target: number | string, intent: number | string) {
    return toFloat(target) === toFloat(intent);
}

export const numbers = {
    divisibleFor,
    equals,
    greaterThan,
    greaterThanOrEqual,
    isEven,
    isOdd,
    lessThan,
    lessThanOrEqual,
};
