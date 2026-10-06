import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";
import { getPath, joinPathname, pipe, trailingPaths } from "../dist/index.js";
import { Dict } from "../node_modules/.cache/sidekicker-benchmark/dict.js";

const samples = 7;
const warmups = 3;
let benchmarkSink = 0;

const rows = Array.from({ length: 10_000 }, (_, id) => ({ id, group: id % 32, value: id * 2 }));
const smallRows = rows.slice(0, 8);
const groupRows = rows.slice(0, 1_500);
const smallGroupRows = rows.slice(0, 8);

const fromWithMap = (items) => new Dict(items.map((item) => [item.id, item.value]));
const groupWithCopies = (items) => {
    const groups = new Dict();
    items.forEach((item) => {
        const group = groups.get(item.group) || [];
        groups.set(item.group, [...group, item]);
    });
    return groups;
};
const getPathWithReduce = (object, path, defaultValue) => {
    if (!path) return undefined;
    const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
    const result = pathArray.reduce((value, key) => value && value[key], object);
    return result === undefined ? defaultValue : result;
};
const joinPathnameWithReduce = (baseURL, ...urls) =>
    urls.reduce((result, url) => trailingPaths(result) + "/" + url.replace(/^\/+/, ""), baseURL);
const pipeWithReduce = (first, second, ...rest) =>
    [first, second, ...rest].reduce(
        (previous, next) =>
            (...args) =>
                next(previous(...args)),
    );

const measure = (fn, iterations, consume) => {
    let checksum = 0;
    const start = performance.now();
    for (let index = 0; index < iterations; index++) checksum += consume(fn());
    benchmarkSink = (benchmarkSink + checksum) % 1_000_000_007;
    return performance.now() - start;
};

const median = (values) => values.toSorted((left, right) => left - right)[Math.floor(values.length / 2)];

const benchmark = (name, reference, optimized, iterations, consume) => {
    const warmupIterations = Math.max(1, Math.floor(iterations / 10));
    for (let index = 0; index < warmups; index++) {
        measure(reference, warmupIterations, consume);
        measure(optimized, warmupIterations, consume);
    }

    const referenceTimes = [];
    const optimizedTimes = [];
    for (let index = 0; index < samples; index++) {
        const first = index % 2 === 0 ? reference : optimized;
        const second = index % 2 === 0 ? optimized : reference;
        const firstTime = measure(first, iterations, consume);
        const secondTime = measure(second, iterations, consume);
        if (first === reference) {
            referenceTimes.push(firstTime);
            optimizedTimes.push(secondTime);
        } else {
            optimizedTimes.push(firstTime);
            referenceTimes.push(secondTime);
        }
    }

    const referenceNs = (median(referenceTimes) * 1_000_000) / iterations;
    const optimizedNs = (median(optimizedTimes) * 1_000_000) / iterations;
    const speedup = referenceNs / optimizedNs;
    console.log(
        `${name.padEnd(24)} baseline ${referenceNs.toFixed(1)} ns/op  optimized ${optimizedNs.toFixed(1)} ns/op  ${speedup.toFixed(2)}x`,
    );
};

const optimizedFrom = () => Dict.from("id", rows, (item) => item.value);
const optimizedSmallFrom = () => Dict.from("id", smallRows, (item) => item.value);
assert.deepEqual(optimizedFrom(), fromWithMap(rows));
assert.deepEqual(optimizedSmallFrom(), fromWithMap(smallRows));

const optimizedGroup = () => Dict.group("group", groupRows);
const optimizedSmallGroup = () => Dict.group("group", smallGroupRows);
assert.deepEqual(optimizedGroup(), groupWithCopies(groupRows));
assert.deepEqual(optimizedSmallGroup(), groupWithCopies(smallGroupRows));

const pathObject = { account: { preferences: { display: { theme: { name: "dark" } } } } };
const path = "account.preferences.display.theme.name";
assert.equal(getPath(pathObject, path), getPathWithReduce(pathObject, path));

const pathParts = ["account", "preferences", "display", "theme", "name"];
assert.equal(getPath(pathObject, pathParts), getPathWithReduce(pathObject, pathParts));

const pathSegments = ["users", "42", "profile"];
assert.equal(
    joinPathname("https://example.test/api///", ...pathSegments),
    joinPathnameWithReduce("https://example.test/api///", ...pathSegments),
);

const addOne = (value) => value + 1;
const double = (value) => value * 2;
const subtractThree = (value) => value - 3;
const square = (value) => value * value;
const legacyPipeline = pipeWithReduce(addOne, double, subtractThree, square);
const optimizedPipeline = pipe(addOne, double, subtractThree, square);
for (const value of [-10, 0, 1, 20]) assert.equal(optimizedPipeline(value), legacyPipeline(value));

console.log(
    `Node ${process.version} (${process.platform}/${process.arch}); ${samples} samples after ${warmups} warmups`,
);
benchmark(
    "Dict.from",
    () => fromWithMap(rows),
    optimizedFrom,
    10,
    (dict) => dict.size + dict.get(0),
);
benchmark(
    "Dict.from (8 rows)",
    () => fromWithMap(smallRows),
    optimizedSmallFrom,
    10_000,
    (dict) => dict.size + dict.get(0),
);
benchmark(
    "Dict.group (8 rows)",
    () => groupWithCopies(smallGroupRows),
    optimizedSmallGroup,
    10_000,
    (dict) => dict.size + dict.get(0).length,
);
benchmark(
    "Dict.group",
    () => groupWithCopies(groupRows),
    optimizedGroup,
    5,
    (dict) => dict.size + dict.get(0).length,
);
benchmark(
    "getPath string",
    () => getPathWithReduce(pathObject, path),
    () => getPath(pathObject, path),
    100_000,
    (value) => value.length,
);
benchmark(
    "getPath segments",
    () => getPathWithReduce(pathObject, pathParts),
    () => getPath(pathObject, pathParts),
    100_000,
    (value) => value.length,
);
benchmark(
    "joinPathname",
    () => joinPathnameWithReduce("https://example.test/api///", ...pathSegments),
    () => joinPathname("https://example.test/api///", ...pathSegments),
    100_000,
    (value) => value.length,
);
benchmark(
    "pipe construction",
    () => pipeWithReduce(addOne, double, subtractThree, square),
    () => pipe(addOne, double, subtractThree, square),
    5_000,
    (fn) => fn.length,
);
benchmark(
    "pipe invocation",
    () => legacyPipeline(13),
    () => optimizedPipeline(13),
    250_000,
    (value) => value,
);

console.log(`benchmark checksum: ${benchmarkSink}`);
