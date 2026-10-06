import { describe, expect, it } from "vitest";
import { Grouping, Linq, OrderedLinq } from "../src";

describe("LINQ query execution", () => {
    it("defers and re-enumerates against a reusable source", () => {
        const source = [1, 2];
        let calls = 0;
        const query = new Linq(source)
            .Where((value) => {
                calls++;
                return value > 1;
            })
            .Select((value) => value * 2);

        expect(calls).toBe(0);
        source.push(3);
        expect(query.ToArray()).toEqual([4, 6]);
        expect(calls).toBe(3);
        expect(query.ToArray()).toEqual([4, 6]);
        expect(calls).toBe(6);
    });

    it("streams infinite input when Take bounds enumeration", () => {
        function* integers() {
            for (let value = 0; ; value++) yield value;
        }

        expect(
            new Linq(integers())
                .Where((value) => value % 2 === 0)
                .Select((value) => value * 3)
                .Take(4)
                .ToArray(),
        ).toEqual([0, 6, 12, 18]);
    });

    it("passes a zero-based index to predicates and selectors", () => {
        expect(
            new Linq(["a", "b", "c"])
                .Where((_value, index) => index > 0)
                .Select((value, index) => `${index}:${value}`)
                .ToArray(),
        ).toEqual(["0:b", "1:c"]);
    });

    it("supports SelectMany with and without a result selector", () => {
        const words = new Linq([
            { name: "Ada", scores: [92, 98] },
            { name: "Grace", scores: [100] },
        ]);
        expect(words.SelectMany((person) => person.scores).ToArray()).toEqual([92, 98, 100]);
        expect(
            words
                .SelectMany(
                    (person) => person.scores,
                    (person, score) => ({ name: person.name, score }),
                )
                .Where((result) => result.score >= 95)
                .ToArray(),
        ).toEqual([
            { name: "Ada", score: 98 },
            { name: "Grace", score: 100 },
        ]);
    });

    it("supports prefix, suffix, and composition operators", () => {
        expect(new Linq([2, 3]).Prepend(1).Append(4).Concat([5]).ToArray()).toEqual([1, 2, 3, 4, 5]);
        expect(new Linq([1, 2, 3, 1, 2]).TakeWhile((value) => value < 3).ToArray()).toEqual([1, 2]);
        expect(new Linq([1, 2, 3, 1, 2]).SkipWhile((value) => value < 3).ToArray()).toEqual([3, 1, 2]);
        expect(new Linq([1, 2, 3, 4]).Skip(1).Take(2).ToArray()).toEqual([2, 3]);
    });

    it("retains only the needed suffix for TakeLast and SkipLast", () => {
        const values = new Linq([1, 2, 3, 4, 5]);
        expect(values.TakeLast(2).ToArray()).toEqual([4, 5]);
        expect(values.SkipLast(2).ToArray()).toEqual([1, 2, 3]);
        expect(values.TakeLast(0).ToArray()).toEqual([]);
        expect(values.SkipLast(0).ToArray()).toEqual([1, 2, 3, 4, 5]);
        expect(values.TakeLast(10).ToArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it("chunks lazily and rejects invalid sizes", () => {
        expect(new Linq([1, 2, 3, 4, 5]).Chunk(2).ToArray()).toEqual([[1, 2], [3, 4], [5]]);
        expect(new Linq<number>([]).Chunk(3).ToArray()).toEqual([]);
        expect(() => new Linq([1]).Chunk(0)).toThrow(RangeError);
    });
    it("partitions a query eagerly in one pass with predicate indexes", () => {
        let reads = 0;
        const source = {
            *[Symbol.iterator]() {
                for (const value of [10, 20, 30, 40]) {
                    reads++;
                    yield value;
                }
            },
        };

        const [matching, nonMatching] = new Linq(source).Partition((_value, index) => index % 2 === 1);

        expect(reads).toBe(4);
        expect(matching).toEqual([20, 40]);
        expect(nonMatching).toEqual([10, 30]);
        expect(new Linq<number>([]).Partition(() => true)).toEqual([[], []]);
    });

    it("defaults empty sequences without changing non-empty sequences", () => {
        expect(new Linq<number>([]).DefaultIfEmpty().ToArray()).toEqual([undefined]);
        expect(new Linq<number>([]).DefaultIfEmpty(7).ToArray()).toEqual([7]);
        expect(new Linq([3]).DefaultIfEmpty(7).ToArray()).toEqual([3]);
    });

    it("uses runtime type guards for OfType and Cast", () => {
        const values = new Linq<unknown>(["first", 2, "last"]);
        const isString = (value: unknown): value is string => typeof value === "string";
        expect(values.OfType(isString).ToArray()).toEqual(["first", "last"]);
        expect(() => values.Cast(isString).ToArray()).toThrow(TypeError);
    });

    it("uses Set semantics for distinct and set operators", () => {
        const values = new Linq([1, 1, 2, 3, 3]);
        expect(values.Distinct().ToArray()).toEqual([1, 2, 3]);
        expect(values.Except([2, 4, 4]).ToArray()).toEqual([1, 3]);
        expect(values.Intersect([2, 2, 3]).ToArray()).toEqual([2, 3]);
        expect(values.Union([3, 4, 4]).ToArray()).toEqual([1, 2, 3, 4]);
    });

    it("supports key-based set operators and preserves first occurrences", () => {
        const first = [
            { id: 1, name: "a" },
            { id: 2, name: "b" },
            { id: 1, name: "c" },
        ];
        expect(new Linq(first).DistinctBy("id").ToArray()).toEqual([first[0], first[1]]);
        expect(new Linq(first).ExceptBy([2], "id").ToArray()).toEqual([first[0]]);
        expect(new Linq(first).IntersectBy([1], "id").ToArray()).toEqual([first[0]]);
        expect(
            new Linq(first)
                .UnionBy(
                    [
                        { id: 2, name: "d" },
                        { id: 3, name: "e" },
                    ],
                    "id",
                )
                .ToArray(),
        ).toEqual([first[0], first[1], { id: 3, name: "e" }]);
    });

    it("compares object elements by identity and recognizes NaN in SequenceEqual", () => {
        const first = { value: 1 };
        const structurallyEqual = { value: 1 };
        expect(new Linq([first, first, structurallyEqual]).Distinct().ToArray()).toEqual([first, structurallyEqual]);
        expect(new Linq([1, Number.NaN]).SequenceEqual([1, Number.NaN])).toBe(true);
        expect(new Linq([1, 2]).SequenceEqual([1, 2, 3])).toBe(false);
    });

    it("zips to the shorter sequence and closes both iterators", () => {
        let firstClosed = false;
        let secondClosed = false;
        function* first() {
            try {
                yield 1;
                yield 2;
            } finally {
                firstClosed = true;
            }
        }
        function* second() {
            try {
                yield "a";
            } finally {
                secondClosed = true;
            }
        }

        expect(new Linq(first()).Zip(second()).ToArray()).toEqual([[1, "a"]]);
        expect(firstClosed).toBe(true);
        expect(secondClosed).toBe(true);
    });
});

describe("ordering, grouping, and joins", () => {
    it("orders stably and computes each ordering key once", () => {
        const values = [
            { group: "a", score: 4, id: 1 },
            { group: "b", score: 2, id: 2 },
            { group: "a", score: 4, id: 3 },
            { group: "a", score: 8, id: 4 },
        ];
        let groupKeyCalls = 0;
        let scoreKeyCalls = 0;
        const ordered = new Linq(values)
            .OrderBy((item) => {
                groupKeyCalls++;
                return item.group;
            })
            .ThenByDescending((item) => {
                scoreKeyCalls++;
                return item.score;
            });

        expect(ordered).toBeInstanceOf(OrderedLinq);
        expect(groupKeyCalls).toBe(0);
        expect(scoreKeyCalls).toBe(0);
        expect(ordered.Select((item) => item.id).ToArray()).toEqual([4, 1, 3, 2]);
        expect(groupKeyCalls).toBe(values.length);
        expect(scoreKeyCalls).toBe(values.length);
    });

    it.each([
        [Number.NaN, 1],
        [1, Number.NaN],
    ])("orders NaN after finite values in either input order", (first, second) => {
        const source = new Linq([first, second]);
        const ordered = source.Order().ToArray();
        expect(ordered[0]).toBe(1);
        expect(ordered[1]).toBeNaN();
        expect(source.MinBy((value) => value)).toBe(1);
        expect(source.MaxBy((value) => value)).toBeNaN();
    });

    it.each([
        [null, undefined],
        [undefined, null],
    ])("orders null before undefined in either input order", (first, second) => {
        const source = new Linq<number | null | undefined>([first, second, 1]);
        expect(source.Order().ToArray()).toStrictEqual([null, undefined, 1]);
        const nullish = new Linq<number | null | undefined>([first, second]);
        expect(nullish.MinBy((value) => value)).toBeNull();
        expect(nullish.MaxBy((value) => value)).toBeUndefined();
    });

    it("supports custom comparers and secondary descending order", () => {
        const values = new Linq(["bbb", "a", "cc"]);
        expect(
            values
                .OrderBy(
                    (value) => value.length,
                    (left, right) => right - left,
                )
                .ToArray(),
        ).toEqual(["bbb", "cc", "a"]);
        expect(
            new Linq([1, 2, 3])
                .OrderBy((value) => value % 2)
                .ThenByDescending((value) => value)
                .ToArray(),
        ).toEqual([2, 3, 1]);
    });

    it("groups lazily while preserving key and element order", () => {
        let reads = 0;
        const source = {
            *[Symbol.iterator]() {
                for (const value of ["ant", "bear", "ape", "bird"]) {
                    reads++;
                    yield value;
                }
            },
        };
        const groups = new Linq(source).GroupBy(
            (word) => word.length,
            (word) => word.toUpperCase(),
        );

        expect(reads).toBe(0);
        const iterator = groups[Symbol.iterator]();
        const first = iterator.next();
        expect(reads).toBe(4);
        expect(first.done).toBe(false);
        expect(first.value).toBeInstanceOf(Grouping);
        expect(first.value?.Key).toBe(3);
        expect(first.value?.ToArray()).toEqual(["ANT", "APE"]);
        iterator.return?.();
    });

    it("joins by hash lookup and preserves outer order", () => {
        const departments = [
            { id: 1, name: "Science" },
            { id: 2, name: "Arts" },
        ];
        const students = [
            { departmentId: 1, name: "Ada" },
            { departmentId: 1, name: "Alan" },
            { departmentId: 3, name: "Grace" },
        ];
        expect(
            new Linq(departments)
                .Join(students, "id", "departmentId", (department, student) => `${department.name}:${student.name}`)
                .ToArray(),
        ).toEqual(["Science:Ada", "Science:Alan"]);
        expect(
            new Linq(departments)
                .GroupJoin(students, "id", "departmentId", (department, group) => [department.name, Array.from(group)])
                .ToArray(),
        ).toEqual([
            ["Science", [students[0], students[1]]],
            ["Arts", []],
        ]);
    });

    it("does not enumerate a join inner source for an empty outer source", () => {
        let innerReads = 0;
        const inner = {
            *[Symbol.iterator]() {
                innerReads++;
                yield { id: 1 };
            },
        };
        expect(new Linq<{ id: number }>([]).Join(inner, "id", "id", (outer) => outer).ToArray()).toEqual([]);
        expect(innerReads).toBe(0);
    });
});

describe("terminal operators and materialization", () => {
    it("short-circuits Any, All, First, and Single", () => {
        let visits = 0;
        expect(
            new Linq([1, 2, 3, 4]).Any((value) => {
                visits++;
                return value === 2;
            }),
        ).toBe(true);
        expect(visits).toBe(2);
        expect(new Linq([10, 20, 30]).Single((_value, index) => index === 0)).toBe(10);
        expect(new Linq([1, 2, 3]).First((value) => value > 1)).toBe(2);
        expect(new Linq([1, 2, 3]).All((value) => value > 0)).toBe(true);
    });

    it("provides empty and cardinality failures with default variants", () => {
        expect(new Linq<number>([]).FirstOrDefault()).toBeUndefined();
        expect(new Linq<number>([]).LastOrDefault()).toBeUndefined();
        expect(new Linq<number>([]).SingleOrDefault()).toBeUndefined();
        expect(new Linq<number>([]).DefaultIfEmpty(7).ToArray()).toEqual([7]);
        expect(() => new Linq<number>([]).First()).toThrow(RangeError);
        expect(() => new Linq<number>([]).Last()).toThrow(RangeError);
        expect(() => new Linq([1, 2]).Single()).toThrow(RangeError);
        expect(() => new Linq([1, 2]).Single((value) => value > 2)).toThrow(RangeError);
    });

    it("supports indexed lookup and default values", () => {
        const values = new Linq(["zero", "one", "two"]);
        expect(values.ElementAt(1)).toBe("one");
        expect(values.ElementAtOrDefault(4)).toBeUndefined();
        expect(() => values.ElementAt(-1)).toThrow(RangeError);
        expect(values.ElementAtOrDefault(-1)).toBeUndefined();
        expect(new Linq([1, 2, 3]).Skip(1).Take(1).ToArray()).toEqual([2]);
    });

    it("aggregates with or without a seed and closes a failing iterator", () => {
        const sum = (accumulator: number, current: number) => accumulator + current;
        expect(new Linq([1, 2, 3]).Aggregate(sum)).toBe(6);
        expect(new Linq([1, 2, 3]).Aggregate(10, sum)).toBe(16);
        expect(new Linq([1, 2, 3]).Aggregate(0, sum, (value) => `sum=${value}`)).toBe("sum=6");
        expect(() => new Linq<number>([]).Aggregate(sum)).toThrow(RangeError);

        let closed = false;
        function* source() {
            try {
                yield 1;
                yield 2;
            } finally {
                closed = true;
            }
        }
        expect(() =>
            new Linq(source()).Aggregate(() => {
                throw new Error("stop");
            }),
        ).toThrow("stop");
        expect(closed).toBe(true);
    });

    it("computes numeric terminals in one traversal with selectors", () => {
        const values = new Linq([{ score: 3 }, { score: 7 }, { score: 2 }]);
        expect(values.Sum("score")).toBe(12);
        expect(values.Average((item) => item.score)).toBe(4);
        expect(values.Min("score")).toBe(2);
        expect(values.Max("score")).toBe(7);
        expect(new Linq([2, 4, 6, 8]).Average()).toBe(5);
        expect(() => new Linq<number>([]).Average()).toThrow(RangeError);
        expect(() => new Linq<number>([]).Min()).toThrow(RangeError);
        expect(() => new Linq<number>([]).Max()).toThrow(RangeError);
    });

    it("supports MinBy and MaxBy over keys", () => {
        const values = new Linq([{ score: 3 }, { score: 7 }, { score: 2 }]);
        expect(values.MinBy("score")).toEqual({ score: 2 });
        expect(values.MaxBy((item) => item.score)).toEqual({ score: 7 });
        expect(new Linq<number>([]).MinBy((value) => value)).toBeUndefined();
    });

    it("materializes arrays, sets, maps, and lookups", () => {
        const people = new Linq([
            { id: 1, group: "a", name: "Ada" },
            { id: 2, group: "a", name: "Alan" },
            { id: 3, group: "b", name: "Grace" },
        ]);
        expect(people.ToArray()).toHaveLength(3);
        expect(people.ToList()).toEqual(people.ToArray());
        expect(people.ToHashSet().size).toBe(3);
        expect(people.ToDictionary("id").get(2)?.name).toBe("Alan");
        expect(people.ToMap("group", (person) => person.name).get("a")).toBe("Alan");
        expect(people.ToLookup("group").get("a")?.length).toBe(2);
        expect(() => new Linq([{ id: 1 }, { id: 1 }]).ToDictionary("id")).toThrow(RangeError);
    });

    it("constructs empty, repeated, and numeric range queries", () => {
        expect(Linq.From([1, 2]).AsEnumerable().ToArray()).toEqual([1, 2]);
        expect(Linq.Empty<number>().Count()).toBe(0);
        expect(Linq.Range(18, 23).ToArray()).toEqual(Array.from({ length: 23 }, (_, index) => index + 18));
        expect(Linq.Repeat("x", 3).ToArray()).toEqual(["x", "x", "x"]);
        expect(() => Linq.Range(2_147_483_647, 2)).toThrow(RangeError);
        expect(() => Linq.Repeat("x", -1)).toThrow(RangeError);
    });
});
