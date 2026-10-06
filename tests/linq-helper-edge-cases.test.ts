import { describe, expect, it } from "vitest";
import { arrayDiff, max, min, multiSort, Order, range, sort, sum } from "../src";

describe("LINQ array helper edge cases", () => {
    it("supports multi-character numeric, stepped, and character ranges", () => {
        expect(range("10..12")).toEqual([10, 11, 12]);
        expect(range("12..10")).toEqual([10, 11, 12]);
        expect(range("1..2..5")).toEqual([1, 3, 5]);
        expect(range("10..2..16")).toEqual([10, 12, 14, 16]);
        expect(range("a..e")).toEqual(["a", "b", "c", "d", "e"]);
        expect(range("a", "e", 2)).toEqual(["a", "c", "e"]);
    });

    it("accepts numeric property and callback selectors for extrema and differences", () => {
        const values = [{ score: -3 }, { score: 8 }, { score: 2 }];
        expect(max(values, "score")).toBe(8);
        expect(min(values, (item, index) => item.score - index)).toBe(-3);
        expect(sum(values, "score")).toBe(7);
        expect(arrayDiff(values, (item, index) => item.score + index)).toBe(-10);
    });

    it("supports native, callback, key, descending, and stable multi-sort modes", () => {
        const values = [
            { group: 1, name: "b" },
            { group: 1, name: "b" },
            { group: 2, name: "a" },
        ];
        const expectedOrder = [values[2], values[0], values[1]];
        expect(sort([20, 3, 100])).toEqual([100, 20, 3]);
        expect(sort([3, 1, 2], (left, right) => left - right)).toEqual([1, 2, 3]);
        expect(sort(values, "name").map((item) => item.group)).toEqual([2, 1, 1]);
        expect(
            multiSort(values, [
                { key: "group", type: Order.Desc },
                { key: "name", type: Order.Asc },
            ]),
        ).toEqual(expectedOrder);
        expect(multiSort(values.slice(0, 2), [])).toEqual(values.slice(0, 2));
    });
    it("covers the coercible-step runtime fallback", () => {
        const step = { [Symbol.toPrimitive]: () => 2 };
        // The fallback remains reachable to JavaScript callers beyond the declared primitive types.
        expect(range(3, step as unknown as number)).toEqual([0, 2, 4]);
    });
});
