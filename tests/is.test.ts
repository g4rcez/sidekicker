import { describe, expect, it } from "vitest";
import { Is } from "../src";

describe("Should test the Is module", () => {
    it.concurrent("Should test Is.undefined", () => {
        expect(Is.undefined(undefined)).toBe(true);
        expect(Is.undefined("")).toBe(false);
        expect(Is.undefined(null)).toBe(false);
        expect((Is.undefined as any)()).toBe(true);
    });

    it.concurrent("Should test Is.null", () => {
        expect(Is.null(undefined)).toBe(false);
        expect(Is.null(null)).toBe(true);
        expect(Is.null(Object.create(null))).toBe(false);
        expect((Is.null as any)()).toBe(false);
    });

    it.concurrent("Should test Is.array", () => {
        expect(Is.array([])).toBe(true);
        expect(Is.array(new Uint8Array())).toBe(false);
        expect(Is.array({ length: 2 })).toBe(false);
    });

    it.concurrent("Should test Is.keyof", () => {
        expect(Is.keyof(new Function(), "name")).toBe(true);
        expect(Is.keyof({}, "hasOwnProperty")).toBe(false)
        expect(Is.keyof({ key: "value", array: [1] }, "array")).toBe(true);
        // primitives are not enumerable
        expect(Is.keyof(1, "toFixed")).toBe(false);
        expect(Is.keyof("", "match")).toBe(false);
        // arrays have a special behaviour
        expect(Is.keyof([0], "0")).toBe(true);
        expect(Is.keyof([1], "1")).toBe(false);
        expect(Is.keyof(Array.from({length:5}), "0")).toBe(true);
    });

    it.concurrent("Should test Is.function", () => {
        expect(Is.function(new Function())).toBe(true);
        expect(Is.function(function() {
        })).toBe(true);
        expect(Is.function(() => {
        })).toBe(true);
    });
});