import { describe, expect, test } from "vitest";
import { clamp } from "../src";

describe("Should test clamp function", () => {
    test("Should test random value", () => {
        expect(clamp(1, 10, 11)).toBe(10);
        expect(clamp(2, 3)).toBe(2);
        expect(clamp(2, 3, 4)).toBe(3);
        expect(clamp(-5, 3, 5)).toBe(3);
        expect(clamp(-5, -1, -1)).toBe(-1);
    });
});