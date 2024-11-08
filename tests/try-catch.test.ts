import { describe, expect, it } from "vitest";
import { catchDefault, exception, tryCatch } from "../src";

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
                const result = a + b;
                if (result === 0) return 0;
                if (result === 2) throw new CustomError();
                if (result === 4) throw null;
                return result;
            },
            exception(CustomError, e => e.name),
            exception(Error, e => e.name),
            exception(Number, e => e.toFixed()),
            exception(String, e => e.toLocaleUpperCase()),
            catchDefault(() => "DEFAULT")
        );
        expect(sum(0, 0).success).toBe(0);
        expect(sum(1, 1).error).toBe("CustomError");
        expect(sum(1, 1).isError()).toBe(true);
        expect(sum(2, 2).isError()).toBe(true);
        expect(sum(2, 2).error).toBe("DEFAULT");
    });
});