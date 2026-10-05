import { describe, expect, it, vi } from "vite-plus/test";
import { debounce, negate, sleep, throttle } from "../src/fp/function";
import { pipe } from "../src";

describe("functional helpers", () => {
    it("pipes a multi-argument first function through unary transforms", () => {
        const result = pipe(
            (value: string, offset: number) => value.length + offset,
            (length: number) => length * 2,
            (length: number) => `${length}!`,
        );

        expect(result("Ada", 2)).toBe("10!");
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
});
