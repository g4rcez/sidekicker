import { Fn } from "../types/utility.type";

export const debounce = <T extends Fn>(fn: T, ms: number, immediate: boolean) => {
    let timeout: NodeJS.Timeout | null = null;
    return function debounceFn(this: ThisType<T>) {
        const context = this;
        const args = arguments as any as Parameters<T>;
        if (timeout) clearTimeout(timeout);
        if (immediate && !timeout) fn.apply(context, args);
        timeout = setTimeout(function() {
            timeout = null;
            if (!immediate) fn.apply(context, args);
        }, ms);
    };
};

export const throttle = <T extends Fn>(func: T, ms: number) => {
    let lastTime: Date | number = 0;
    return function(...args: Parameters<T>) {
        let now = new Date();
        const result = (now as any as number) - (lastTime as any as number);
        if (result >= ms) {
            func(...args);
            lastTime = now;
        }
    };
};

export const sleep = (ms: number): Promise<void> => new Promise(res => setTimeout(res, ms));
