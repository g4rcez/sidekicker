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

export const sleep = (ms: number): Promise<void> => {
    const { promise, resolve } = Promise.withResolvers<void>();
    setTimeout(resolve, ms);
    return promise;
};
export type RetryOptions = {
    /** Number of attempts after the first call. */
    retries: number;
    /** Delay before each retry, or a function of the failed attempt number and error. */
    delay?: number | ((attempt: number, error: unknown) => number);
    signal?: AbortSignal;
    shouldRetry?: (error: unknown, attempt: number) => boolean;
};

const abortReason = (signal: AbortSignal) => {
    if (signal.reason !== undefined) return signal.reason;
    const error = new Error("The operation was aborted");
    error.name = "AbortError";
    return error;
};

const validateRetryDelay = (delay: number) => {
    if (!Number.isFinite(delay) || delay < 0 || delay > 2_147_483_647) {
        throw new RangeError("Retry delay must be a finite number from 0 to 2147483647");
    }
};

const waitForRetry = (delay: number, signal?: AbortSignal): Promise<void> => {
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    if (signal === undefined) {
        setTimeout(resolve, delay);
        return promise;
    }
    if (signal.aborted) {
        reject(abortReason(signal));
        return promise;
    }

    let timer: ReturnType<typeof setTimeout>;
    const onAbort = () => {
        clearTimeout(timer);
        signal.removeEventListener("abort", onAbort);
        reject(abortReason(signal));
    };
    timer = setTimeout(() => {
        signal.removeEventListener("abort", onAbort);
        resolve();
    }, delay);
    signal.addEventListener("abort", onAbort, { once: true });
    return promise;
};

export const retry = async <T>(
    fn: (signal: AbortSignal | undefined, attempt: number) => T | PromiseLike<T>,
    options: RetryOptions,
): Promise<T> => {
    if (!Number.isSafeInteger(options.retries) || options.retries < 0) {
        throw new RangeError("Retry count must be a non-negative safe integer");
    }
    if (typeof options.delay === "number") validateRetryDelay(options.delay);

    let attempt = 1;
    while (true) {
        if (options.signal?.aborted) throw abortReason(options.signal);
        try {
            const result = await fn(options.signal, attempt);
            if (options.signal?.aborted) throw abortReason(options.signal);
            return result;
        } catch (error) {
            if (options.signal?.aborted) throw abortReason(options.signal);
            if (attempt > options.retries || (options.shouldRetry && !options.shouldRetry(error, attempt))) {
                throw error;
            }
            const delay = typeof options.delay === "function" ? options.delay(attempt, error) : (options.delay ?? 0);
            validateRetryDelay(delay);
            if (delay > 0) await waitForRetry(delay, options.signal);
            attempt++;
        }
    }
};

export const negate = (prev: boolean) => !prev;
