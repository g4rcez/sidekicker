import { describe, expect, it } from "vite-plus/test";
import { Either } from "../src";

const test = it.concurrent;

describe("Should test Either class", () => {
    test("Left and Right basic", () => {
        const right = Either.success(20);
        expect(right.success).toBe(20);

        const left = Either.error(null);
        expect(left.error).toBe(null);
    });

    test("Extract from a function", () => {
        const fn = (n: number) => (n === 1 ? Either.success("Cool") : Either.error(null));
        const result = fn(1);
        if (result.isSuccess()) {
            expect(result.success).toBe("Cool");
        }
    });
    test("Transforms synchronous success and failure into Either values", () => {
        const success = Either.transform((value: number) => value * 2)(4);
        const error = new Error("sync failure");
        const failure = Either.transform((): number => {
            throw error;
        })();

        expect(success.isSuccess()).toBe(true);
        expect(success.success).toBe(8);
        expect(failure.isError()).toBe(true);
        expect(failure.error).toBe(error);
    });

    test("Transforms promised success and failure into Either values", async () => {
        const success = await Either.transform(async () => "complete")();
        const error = new Error("async failure");
        const failure = await Either.transform(async (): Promise<string> => {
            throw error;
        })();

        expect(success.success).toBe("complete");
        expect(failure.isError()).toBe(true);
        expect(failure.error).toBe(error);
    });
});
