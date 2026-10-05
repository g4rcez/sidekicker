import { describe, expect, it } from "vite-plus/test";
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
        expect(Is.keyof(() => undefined, "name")).toBe(true);
        expect(Is.keyof({}, "hasOwnProperty")).toBe(false);
        expect(Is.keyof({ key: "value", array: [1] }, "array")).toBe(true);
        // primitives are not enumerable
        expect(Is.keyof(1, "toFixed")).toBe(false);
        expect(Is.keyof("", "match")).toBe(false);
        // arrays have a special behaviour
        expect(Is.keyof([0], "0")).toBe(true);
        expect(Is.keyof([1], "1")).toBe(false);
        expect(Is.keyof(Array.from({ length: 5 }), "0")).toBe(true);
    });

    it.concurrent("Should test Is.function", () => {
        expect(Is.function(() => undefined)).toBe(true);
        expect(Is.function(function () {})).toBe(true);
        expect(Is.function(() => {})).toBe(true);
    });
    it.concurrent("Should test Is.date, Is.instance, and Is.isError", () => {
        expect(Is.date(new Date())).toBe(true);
        expect(Is.date({})).toBe(false);
        expect(Is.instance(new Date(), Date)).toBe(true);
        expect(Is.instance({}, Date)).toBe(false);
        expect(Is.isError(new TypeError("failure"))).toBe(true);
        expect(Is.isError({ message: "failure" })).toBe(false);
    });

    it.concurrent("Should test Is.empty for supported value types", () => {
        expect(Is.empty(null)).toBe(true);
        expect(Is.empty(undefined)).toBe(true);
        expect(Is.empty("")).toBe(true);
        expect(Is.empty("value")).toBe(false);
        expect(Is.empty([])).toBe(true);
        expect(Is.empty([1])).toBe(false);
        const sparse: number[] = [];
        sparse.length = 2;
        expect(Is.empty(sparse)).toBe(false);
        expect(Is.empty({})).toBe(true);
        expect(Is.empty({ value: 1 })).toBe(false);
        expect(Is.empty(Number.NaN)).toBe(true);
        expect(Is.empty(0)).toBe(false);
    });

    it.concurrent("Should test Is.nan, Is.nil, Is.number, and Is.string", () => {
        expect(Is.nan(Number.NaN)).toBe(true);
        expect(Is.nan(0)).toBe(false);
        expect(Is.nil(null)).toBe(true);
        expect(Is.nil(undefined)).toBe(true);
        expect(Is.nil(false)).toBe(false);
        expect(Is.number(1)).toBe(true);
        expect(Is.number(Number.NaN)).toBe(false);
        expect(Is.number("1")).toBe(false);
        expect(Is.string("value")).toBe(true);
        expect(Is.string(1)).toBe(false);
    });

    it.concurrent("Should distinguish objects from primitive values", () => {
        expect(Is.object({})).toBe(true);
        expect(Is.object([])).toBe(false);
        expect(Is.object(null)).toBe(false);
        expect(Is.primitive(undefined)).toBe(true);
        expect(Is.primitive(null)).toBe(true);
        expect(Is.primitive(false)).toBe(true);
        expect(Is.primitive(1n)).toBe(true);
        expect(Is.primitive(Symbol("key"))).toBe(true);
        expect(Is.primitive({})).toBe(false);
        expect(Is.function(1)).toBe(false);
    });
});
