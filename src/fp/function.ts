import type { Fn } from "../types/utility.type";

export const debounce = <T extends Fn>(fn: T, ms: number, immediate: boolean) => {
    let timeout: number | NodeJS.Timeout | undefined;
    return function debounceFn(this: ThisParameterType<T>, ...args: Parameters<T>) {
        clearTimeout(timeout);
        if (immediate && !timeout) fn.apply(this, args);
        timeout = setTimeout(() => {
            timeout = undefined;
            if (!immediate) fn.apply(this, args);
        }, ms);
    };
};

export const throttle = <T extends Fn>(func: T, ms: number) => {
    let lastTime: Date | number = 0;
    return function (...args: Parameters<T>) {
        let now = new Date();
        const result = (now as any as number) - (lastTime as any as number);
        if (result >= ms) {
            func(...args);
            lastTime = now;
        }
    };
};

export const sleep = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

export const negate = (prev: boolean) => !prev;
