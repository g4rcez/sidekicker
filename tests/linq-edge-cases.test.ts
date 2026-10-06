import { describe, expect, it } from "vitest";
import { Linq } from "../src";

describe("LINQ edge cases", () => {
    it("checks integer ranges and count limits", () => {
        expect(Linq.Range(-2_147_483_648, 1).ToArray()).toEqual([-2_147_483_648]);
        expect(Linq.Range(1, 0).ToArray()).toEqual([]);
        expect(() => Linq.Range(Number.NaN, 1)).toThrow(RangeError);
        expect(() => Linq.Range(-2_147_483_649, 0)).toThrow(RangeError);
        expect(() => Linq.Range(2_147_483_648, 0)).toThrow(RangeError);
        expect(() => Linq.Range(0, 1.5)).toThrow(RangeError);
        expect(() => Linq.Range(0, -1)).toThrow(RangeError);
        expect(() => Linq.Range(0, 2_147_483_648)).toThrow(RangeError);
        expect(() => Linq.Repeat("x", 1.5)).toThrow(RangeError);
        expect(() => Linq.Repeat("x", 2_147_483_648)).toThrow(RangeError);
    });

    it("treats negative partition counts as zero and rejects non-integers", () => {
        const values = new Linq([1, 2, 3]);
        expect(values.Take(-2).ToArray()).toEqual([]);
        expect(values.Skip(-2).ToArray()).toEqual([1, 2, 3]);
        expect(values.TakeLast(-2).ToArray()).toEqual([]);
        expect(values.SkipLast(-2).ToArray()).toEqual([1, 2, 3]);
        expect(() => values.Take(Number.NaN)).toThrow(RangeError);
        expect(() => values.Skip(1.5)).toThrow(RangeError);
    });

    it("reverses reusable and empty sources", () => {
        expect(new Linq([1, 2, 3]).Reverse().ToArray()).toEqual([3, 2, 1]);
        expect(new Linq<number>([]).Reverse().ToArray()).toEqual([]);
    });

    it("supports descending primary and ascending secondary ordering", () => {
        expect(
            new Linq([
                { score: 3, name: "b" },
                { score: 4, name: "z" },
                { score: 3, name: "a" },
            ])
                .OrderByDescending("score")
                .ThenBy("name")
                .ToArray()
                .map((item) => item.name),
        ).toEqual(["z", "a", "b"]);
    });

    it("exposes Grouping count, iteration, and copied values", () => {
        const group = new Linq(["ant", "ape", "bear"]).GroupBy((word) => word.length).First();
        expect(group.Count).toBe(2);
        expect(Array.from(group)).toEqual(["ant", "ape"]);
        const copy = group.ToArray();
        copy.push("other");
        expect(group.ToArray()).toEqual(["ant", "ape"]);
        expect(new Linq<string>([]).GroupBy((word) => word.length).ToArray()).toEqual([]);
    });

    it("skips null join keys while preserving unmatched GroupJoin rows", () => {
        const outer = [
            { id: null as number | null, label: "null" },
            { id: 1 as number | null, label: "one" },
            { id: 2 as number | null, label: "two" },
        ];
        const inner = [
            { id: null as number | null, value: "ignored" },
            { id: 1 as number | null, value: "match" },
        ];
        expect(
            new Linq(outer).Join(inner, "id", "id", (left, right) => `${left.label}:${right.value}`).ToArray(),
        ).toEqual(["one:match"]);
        expect(
            new Linq(outer)
                .GroupJoin(inner, "id", "id", (left, matches) => [
                    left.label,
                    Array.from(matches, (item) => item.value),
                ])
                .ToArray(),
        ).toEqual([
            ["null", []],
            ["one", ["match"]],
            ["two", []],
        ]);
    });

    it("supports Zip result selectors and closes both iterators when the first ends", () => {
        let firstClosed = false;
        let secondClosed = false;
        function* first() {
            try {
                yield 5;
            } finally {
                firstClosed = true;
            }
        }
        function* second() {
            try {
                yield 2;
                yield 3;
            } finally {
                secondClosed = true;
            }
        }

        expect(new Linq(first()).Zip(second(), (left, right, index) => left + right + index).ToArray()).toEqual([7]);
        expect(firstClosed).toBe(true);
        expect(secondClosed).toBe(true);
    });

    it("compares unequal values and supports an explicit equality comparer", () => {
        expect(new Linq([1, 2]).SequenceEqual([1, 3])).toBe(false);
        expect(
            new Linq(["Ada", "Grace"]).SequenceEqual(
                ["ada", "GRACE"],
                (left, right) => left.toLowerCase() === right.toLowerCase(),
            ),
        ).toBe(true);
        expect(new Linq<number>([]).SequenceEqual([])).toBe(true);
        expect(new Linq([1, 2, 3]).SequenceEqual([1, 2])).toBe(false);
    });

    it("covers short-circuiting and collection terminals", () => {
        expect(new Linq([1, 2, 3]).Any((value) => value > 5)).toBe(false);
        expect(new Linq([1, 2, 3]).All((value) => value < 3)).toBe(false);
        expect(new Linq([1, Number.NaN]).Contains(Number.NaN)).toBe(true);
        expect(new Linq([1, 2, 3]).Contains(4)).toBe(false);
        expect(new Linq([1, 2, 3]).Count()).toBe(3);
        expect(new Linq([1, 2, 3]).Count((value) => value % 2 === 1)).toBe(2);
        expect(
            new Linq(
                new Map([
                    ["a", 1],
                    ["b", 2],
                ]),
            ).Count(),
        ).toBe(2);
        expect(new Linq(new Set([1, 2, 3])).LongCount()).toBe(3);

        const iterable = {
            *[Symbol.iterator]() {
                yield 4;
                yield 5;
                yield 6;
            },
        };
        expect(new Linq(iterable).Count()).toBe(3);
        expect(new Linq(iterable).Count((_value, index) => index === 1)).toBe(1);
        expect(new Linq(iterable).LongCount((value) => value > 4)).toBe(2);
    });

    it("covers predicate defaults and last/single cardinality", () => {
        const values = new Linq([1, 2, 3]);
        expect(values.FirstOrDefault((value) => value === 2)).toBe(2);
        expect(values.FirstOrDefault((value) => value > 3)).toBeUndefined();
        expect(values.Last()).toBe(3);
        expect(values.Last((value) => value < 3)).toBe(2);
        expect(values.LastOrDefault((value) => value < 3)).toBe(2);
        expect(values.LastOrDefault((value) => value > 3)).toBeUndefined();
        expect(() => new Linq<number>([]).Last()).toThrow(RangeError);
        expect(() => values.Last((value) => value > 3)).toThrow(RangeError);
        expect(values.SingleOrDefault((value) => value === 2)).toBe(2);
        expect(() => values.SingleOrDefault()).toThrow(RangeError);
        expect(() => values.SingleOrDefault((value) => value > 0)).toThrow(RangeError);
    });

    it("indexes array and non-array iterables with default and throwing variants", () => {
        const values = new Linq(["a", "b"]);
        expect(values.ElementAt(1)).toBe("b");
        expect(() => values.ElementAt(2)).toThrow(RangeError);
        expect(values.ElementAtOrDefault(2)).toBeUndefined();

        const iterable = new Set(["x", "y"]);
        expect(new Linq(iterable).ElementAt(1)).toBe("y");
        expect(new Linq(iterable).ElementAtOrDefault(0)).toBe("x");
        expect(new Linq(iterable).ElementAtOrDefault(2)).toBeUndefined();
        expect(() => new Linq(iterable).ElementAt(2)).toThrow(RangeError);
        expect(new Linq(iterable).ElementAtOrDefault(Number.POSITIVE_INFINITY)).toBeUndefined();
    });

    it("orders default comparable key types and rejects unsupported comparisons", () => {
        expect(new Linq(["z", "a"]).Order().ToArray()).toEqual(["a", "z"]);
        expect(
            new Linq([new Date(2), new Date(1)])
                .Order()
                .ToArray()
                .map((date) => date.getTime()),
        ).toEqual([1, 2]);
        expect(new Linq([2n, 1n]).Order().ToArray()).toEqual([1n, 2n]);
        expect(new Linq([true, false]).Order().ToArray()).toEqual([false, true]);
        expect(() => new Linq([{}, {}]).Order().ToArray()).toThrow(TypeError);
        expect(
            new Linq([{ id: 2 }, { id: 1 }])
                .OrderBy(
                    (item) => item.id,
                    (left, right) => left - right,
                )
                .ToArray(),
        ).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it("rejects Aggregate calls without a reducer at runtime", () => {
        expect(() => new Linq([1]).Aggregate(0, undefined as never)).toThrow(TypeError);
    });
});
