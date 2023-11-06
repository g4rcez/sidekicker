import { describe, expect, it } from "vitest";
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
        const fn = (n: number) => n === 1 ? Either.success("Cool") : Either.error(null);
        const result = fn(1);
        if (result.isSuccess()) {
            expect(result.success === "Cool");
        }
    });
});
