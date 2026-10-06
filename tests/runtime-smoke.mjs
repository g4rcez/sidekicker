import assert from "node:assert/strict";
import { arrayDiff, clamp, diff, Linq, toQueryString } from "../dist/index.js";

assert.equal(clamp(0, 10, 5), 5);
assert.equal(toQueryString({ page: 2 }), "utf8=%E2%9C%93&page=2");

assert.deepEqual(
    new Linq([1, 2, 3, 4])
        .Where((value) => value % 2 === 0)
        .Select((value) => value * 2)
        .ToArray(),
    [4, 8],
);
assert.deepEqual(new Linq([3, 1, 2]).Order().ToArray(), [1, 2, 3]);
assert.equal(arrayDiff([2, 5]), -7);
assert.equal(diff({ value: 1 }, { value: 2 }, ["value"]), true);
