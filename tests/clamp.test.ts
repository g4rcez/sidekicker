import { describe, expect, test } from "vite-plus/test";
import { clamp, dec, even, inc, odd } from "../src";

describe("Should test clamp function", () => {
    test("Should test random value", () => {
        expect(clamp(1, 10, 11)).toBe(10);
        expect(clamp(2, 3, 4)).toBe(3);
        expect(clamp(-5, 3, 5)).toBe(3);
        expect(clamp(-5, -1, -1)).toBe(-1);
    });
    test("Should test the integer helpers", () => {
        expect(even(2)).toBe(true);
        expect(even(3)).toBe(false);
        expect(odd(3)).toBe(true);
        expect(odd(2)).toBe(false);
        expect(inc(4)).toBe(5);
        expect(dec(4)).toBe(3);
    });
});
