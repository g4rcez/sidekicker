import { describe, expect, it } from "vitest";
import { arrayDiff, chunk, dict, distinct, max, min, multiSort, Order, partition, range, sort, sum } from "../src";

describe("optimized LINQ package helpers", () => {
    it("chunks in linear passes and rejects invalid sizes", () => {
        expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
        expect(chunk([], 3)).toEqual([]);
        expect(() => chunk([1], 0)).toThrow(RangeError);
        expect(() => chunk([1], Number.POSITIVE_INFINITY)).toThrow(RangeError);
    });

    it("partitions a one-shot iterable once and preserves input indexes", () => {
        let enumerations = 0;
        function* values() {
            enumerations++;
            yield 10;
            yield 20;
            yield 30;
            yield 40;
        }

        expect(partition(values(), (_value, index) => index === 1 || index === 2)).toEqual([
            [20, 30],
            [10, 40],
        ]);
        expect(enumerations).toBe(1);
        expect(partition([], () => true)).toEqual([[], []]);
    });

    it("uses Set identity and SameValueZero while preserving order", () => {
        const first = { value: 1 };
        const structurallyEqual = { value: 1 };
        expect(distinct([first, first, structurallyEqual])).toEqual([first, structurallyEqual]);
        expect(distinct([Number.NaN, Number.NaN, 0, -0])).toEqual([Number.NaN, 0]);
    });

    it("builds dictionaries in one pass and keeps the last duplicate key", () => {
        const rows = [
            { id: 1, value: "first" },
            { id: 2, value: "second" },
            { id: 1, value: "last" },
        ];
        expect(dict(rows, "id")).toEqual({ 1: rows[2], 2: rows[1] });
    });

    it("handles negative inputs, selectors, and empty sums", () => {
        expect(max([-10, -2, -7])).toBe(-2);
        expect(min([-10, -2, -7])).toBe(-10);
        expect(sum([{ score: 2 }, { score: 5 }], "score")).toBe(7);
        expect(sum([{ score: 2 }, { score: 5 }], (item, index) => item.score + index)).toBe(8);
        expect(sum([])).toBe(0);
        expect(arrayDiff([2, 5])).toBe(-7);
        expect(() => max([])).toThrow(RangeError);
        expect(() => min([])).toThrow(RangeError);
    });

    it("supports numeric and character ranges", () => {
        expect(range("1..3")).toEqual([1, 2, 3]);
        expect(range("a..c")).toEqual(["a", "b", "c"]);
        expect(range("1", "5", 2)).toEqual([1, 3, 5]);
    });

    it("sorts copies and applies multi-key order without reduce", () => {
        const values = [
            { id: 1, name: "c" },
            { id: 1, name: "b" },
            { id: 2, name: "a" },
        ];
        const sorted = sort(values, "name");
        expect(sorted.map((item) => item.name)).toEqual(["a", "b", "c"]);
        expect(values[0]?.name).toBe("c");

        const first = values[1];
        expect(
            multiSort(values, [
                { key: "id", type: Order.Asc },
                { key: "name", type: Order.Asc },
            ])[0],
        ).toBe(first);
    });
});
