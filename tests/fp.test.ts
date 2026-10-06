import { describe, expect, it, vi } from "vite-plus/test";
import { debounce, negate, pipe, retry, sleep, throttle } from "../src";

describe("functional helpers", () => {
    it("pipes a multi-argument first function through unary transforms", () => {
        const result = pipe(
            (value: string, offset: number) => value.length + offset,
            (length: number) => length * 2,
            (length: number) => `${length}!`,
        );

        expect(result("Ada", 2)).toBe("10!");
    });

    it("runs each composed stage once in order and stops on a thrown error", () => {
        const calls: string[] = [];
        const result = pipe(
            (value: number) => {
                calls.push("first");
                return value + 1;
            },
            (value: number) => {
                calls.push("second");
                return value * 2;
            },
            (value: number) => {
                calls.push("third");
                return value - 1;
            },
        );

        expect(result(2)).toBe(5);
        expect(calls).toEqual(["first", "second", "third"]);

        const failing = pipe(
            (value: number) => value,
            (_value: number): number => {
                throw new Error("pipeline failed");
            },
            (value: number) => value + 1,
        );
        expect(() => failing(1)).toThrow("pipeline failed");
    });

    it("debounces calls and invokes only the latest arguments", async () => {
        vi.useFakeTimers();
        try {
            const callback = vi.fn<(value: string) => void>();
            const debounced = debounce(callback, 100, false);

            debounced("first");
            debounced("latest");
            expect(callback).not.toHaveBeenCalled();
            await vi.advanceTimersByTimeAsync(100);

            expect(callback).toHaveBeenCalledTimes(1);
            expect(callback).toHaveBeenCalledWith("latest");
        } finally {
            vi.useRealTimers();
        }
    });

    it("supports immediate debounce and throttles calls by the configured interval", () => {
        vi.useFakeTimers();
        try {
            const immediateCallback = vi.fn();
            const immediate = debounce(immediateCallback, 100, true);
            immediate("first");
            immediate("second");
            expect(immediateCallback).toHaveBeenCalledTimes(1);
            expect(immediateCallback).toHaveBeenCalledWith("first");

            vi.setSystemTime(new Date(1_000));
            const throttledCallback = vi.fn();
            const throttled = throttle(throttledCallback, 100);
            throttled("first");
            throttled("blocked");
            vi.advanceTimersByTime(100);
            throttled("after interval");

            expect(throttledCallback).toHaveBeenCalledTimes(2);
            expect(throttledCallback).toHaveBeenLastCalledWith("after interval");
        } finally {
            vi.useRealTimers();
        }
    });

    it("resolves after sleeping and negates booleans", async () => {
        vi.useFakeTimers();
        try {
            const waiting = sleep(50);
            await vi.advanceTimersByTimeAsync(50);
            await expect(waiting).resolves.toBeUndefined();
        } finally {
            vi.useRealTimers();
        }

        expect(negate(true)).toBe(false);
        expect(negate(false)).toBe(true);
    });
    it("retries until the operation succeeds within the configured count", async () => {
        let calls = 0;
        const result = await retry(
            (_signal, attempt) => {
                calls++;
                if (attempt < 3) throw new Error("temporary failure");
                return "done";
            },
            { retries: 2 },
        );

        expect(result).toBe("done");
        expect(calls).toBe(3);
    });

    it("preserves the last error and stops when shouldRetry declines", async () => {
        const failure = new Error("permanent failure");
        const operation = vi.fn(() => {
            throw failure;
        });

        await expect(retry(operation, { retries: 3, shouldRetry: () => false })).rejects.toBe(failure);
        expect(operation).toHaveBeenCalledTimes(1);

        await expect(retry(operation, { retries: 1 })).rejects.toBe(failure);
        expect(operation).toHaveBeenCalledTimes(3);
    });

    it("uses dynamic delays and aborts a pending retry", async () => {
        vi.useFakeTimers();
        try {
            const controller = new AbortController();
            const cancellation = new Error("cancelled");
            const delays: number[] = [];
            const operation = vi.fn((_signal: AbortSignal | undefined, _attempt: number) => {
                throw new Error("temporary failure");
            });
            const pending = retry(operation, {
                retries: 3,
                delay: (attempt) => {
                    const delay = attempt * 10;
                    delays.push(delay);
                    return delay;
                },
                signal: controller.signal,
            });

            await vi.advanceTimersByTimeAsync(0);
            expect(operation).toHaveBeenCalledTimes(1);
            await vi.advanceTimersByTimeAsync(10);
            expect(operation).toHaveBeenCalledTimes(2);
            expect(operation.mock.calls).toEqual([
                [controller.signal, 1],
                [controller.signal, 2],
            ]);
            expect(delays).toEqual([10, 20]);

            controller.abort(cancellation);
            await expect(pending).rejects.toBe(cancellation);
            await vi.runAllTimersAsync();
            expect(operation).toHaveBeenCalledTimes(2);
        } finally {
            vi.useRealTimers();
        }
    });

    it("rejects invalid retry counts and delays before invoking the operation", async () => {
        const operation = vi.fn(() => "unused");

        await expect(retry(operation, { retries: -1 })).rejects.toThrow(RangeError);
        await expect(retry(operation, { retries: 1, delay: Number.POSITIVE_INFINITY })).rejects.toThrow(RangeError);
        expect(operation).not.toHaveBeenCalled();
    });
});
