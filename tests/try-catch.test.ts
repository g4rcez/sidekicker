import { describe, expect, it } from "vitest";
import { exception, tryCatch } from "../src";

const test = it.concurrent;

class CustomError extends Error {
    constructor() {
        super();
        this.name = "CustomError";
        this.message = "Custom Error";
    }
}

describe("Should test tryCatch function", () => {
    test("✅Should test without promise return", () => {
        const sum = tryCatch((a: number, b: number) => {
                if (a || b) throw new CustomError();
                return a + b;
            },
            exception(CustomError, e => e.name)
        );
        expect(sum(0, 0).success).toBe(0);
        expect(sum(1, 1).error).toBe("CustomError");
        expect(sum(1, 1).isError()).toBe(true);
    });
});