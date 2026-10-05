import { describe, expect, it } from "vite-plus/test";
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
        const sum = tryCatch(
            (a: number, b: number) => {
                const result = a + b;
                if (result === 0) return 0;
                if (result === 2) throw new CustomError();
                if (result === 4) throw null;
                return result;
            },
            exception(CustomError, (e) => e.name),
            exception(Error, (e) => e.name),
            exception(Number, (e) => e.toFixed()),
            exception(String, (e) => e.toLocaleUpperCase()),
            catchDefault(() => "DEFAULT"),
        );
        expect(sum(0, 0).success).toBe(0);
        expect(sum(1, 1).error).toBe("CustomError");
        expect(sum(1, 1).isError()).toBe(true);
        expect(sum(2, 2).isError()).toBe(true);
        expect(sum(2, 2).error).toBe("DEFAULT");
    });
    test("maps thrown numbers, strings, and errors", () => {
        const handler = tryCatch(
            (kind: string): string => {
                if (kind === "number") throw 42;
                if (kind === "string") throw "failure";
                if (kind === "error") throw new Error("failed");
                if (kind === "other") throw {};
                return kind;
            },
            exception(Number, (error) => error.toFixed(1)),
            exception(String, (error) => error.toUpperCase()),
            exception(Error, (error) => error.message),
            catchDefault(() => "DEFAULT"),
        );

        expect(handler("number").error).toBe("42.0");
        expect(handler("string").error).toBe("FAILURE");
        expect(handler("error").error).toBe("failed");
        expect(handler("other").error).toBe("DEFAULT");
    });

    test("handles promise resolution and rejection", async () => {
        const handler = tryCatch(
            async (shouldThrow: boolean) => {
                if (shouldThrow) throw new Error("async failure");
                return "complete";
            },
            exception(Error, (error) => error.message),
            catchDefault(() => "DEFAULT"),
        );

        expect((await handler(false)).success).toBe("complete");
        expect((await handler(true)).error).toBe("async failure");
    });

    test("returns unmapped thrown values when no default handler is configured", () => {
        const error = new TypeError("unmapped");
        const handler = tryCatch((): void => {
            throw error;
        });

        expect(handler().isError()).toBe(true);
        expect(handler().error).toBe(error);
    });
});
