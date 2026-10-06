# sidekicker

Sidekicker is a TypeScript utility library with a LINQ-style query API. See the [examples guide](docs/README.md) for runnable examples across the query and helper APIs.

## API

### LINQ to Objects

Sidekicker provides a LINQ-style query API over synchronous `Iterable<T>` sources:

```typescript
import { Linq } from "sidekicker";

const numbers = [0, 1, 2, 3, 4, 5, 6];
const evenSquares = new Linq(numbers).Where((number) => number % 2 === 0).Select((number) => number ** 2);

// No work is done until the query is enumerated.
const values = evenSquares.ToArray(); // [0, 4, 16, 36]
```

Sequence operators are deferred and return new queries without mutating the source query. Scalar operators execute immediately and short-circuit where possible. Each iteration re-enumerates a reusable source, so edits to an array are observed; a one-shot generator remains one-shot.

Indexed predicates and selectors receive a zero-based index:

```typescript
const thirdAndLater = new Linq(numbers).Where((_number, index) => index >= 2);
const indexed = thirdAndLater.Select((number, index) => ({ number, index }));
```

### Construction and composition

`Linq.From(source)`, `Linq.Empty<T>()`, `Linq.Range(start, count)`, and `Linq.Repeat(value, count)` create queries. Instance operators include `AsEnumerable`, `Append`, `Prepend`, `Concat`, `DefaultIfEmpty`, `Chunk`, and `Reverse`.

### Filtering and projection

`Where`, `OfType`, `Cast`, `Select`, `SelectMany`, `Take`, `Skip`, `TakeWhile`, `SkipWhile`, `TakeLast`, and `SkipLast` return deferred sequences.

```typescript
const names = new Linq([
    { name: "Ada", scores: [92, 98] },
    { name: "Grace", scores: [100] },
])
    .SelectMany(
        (person) => person.scores,
        (person, score) => ({ name: person.name, score }),
    )
    .Where((result) => result.score >= 95)
    .ToArray();
```

`OfType` and `Cast` take a TypeScript type guard because generic type parameters are erased at runtime. `OfType` skips values that fail the guard; `Cast` throws a `TypeError` on the first mismatch:

```typescript
const isString = (value: unknown): value is string => typeof value === "string";
const strings = new Linq<unknown>(["a", 1, "b"]).OfType(isString);
const checked = new Linq<unknown>(["a", 1, "b"]).Cast(isString); // Throws during enumeration.
```

### Ordering, grouping, and joins

`Order`, `OrderBy`, and `OrderByDescending` accept an optional comparator. Ordered queries support `ThenBy` and `ThenByDescending`; sorting is stable and evaluates each key selector once per element per enumeration.

`GroupBy` returns `Grouping<TKey, TElement>` values with a `Key`, `Count`, iteration, and `ToArray`. `Join` and `GroupJoin` preserve outer-sequence order and use a hash lookup for inner keys.

### Set and sequence operators

`Distinct`, `DistinctBy`, `Except`, `ExceptBy`, `Intersect`, `IntersectBy`, `Union`, `UnionBy`, `SequenceEqual`, and `Zip` use streaming iterators and `Set` lookups where appropriate. Set operators preserve first-sequence order and yield unique values. Set and grouping keys use JavaScript `Set`/`Map` semantics; object keys compare by identity.

### Terminal operators

`Aggregate`, `All`, `Any`, `Average`, `Contains`, `Count`, `LongCount`, `ElementAt`, `ElementAtOrDefault`, `First`, `FirstOrDefault`, `Last`, `LastOrDefault`, `Single`, `SingleOrDefault`, `Min`, `Max`, `MinBy`, and `MaxBy` execute immediately. Numeric aggregates accept a number selector or numeric property key where relevant. `First`, `Last`, `Single`, `Average`, `Min`, and `Max` throw `RangeError` when no required result exists; the `OrDefault` variants return `undefined` when there is no match.

### Materialization and execution

`ToArray` and `ToList` return arrays; `ToHashSet` returns a `Set`; `ToDictionary` and `ToMap` return `Map` instances; `ToLookup` returns `Map<TKey, TElement[]>`. `ToDictionary` throws on duplicate keys, while `ToMap` overwrites earlier values for duplicate keys.

`Where`, `Select`, `SelectMany`, `Take`, `Skip`, `TakeWhile`, `SkipWhile`, `Append`, `Prepend`, `Concat`, `Distinct`, and `Zip` can produce values without reading the whole source. `Take` therefore works with an infinite iterable. `Order`, `OrderBy`, `GroupBy`, `Reverse`, `Join`, and `GroupJoin` buffer or build lookups; set operators retain lookup state. Avoid fully enumerating unbounded sources with `ToArray`, `Count`, sorting, grouping, reversing, or joins.

The API targets synchronous LINQ-to-Objects. It does not implement `IQueryable`, SQL translation, expression trees, async iterables, or C# query-expression syntax.

### Array helpers

Sidekicker also exports optimized array helpers: `chunk`, `dict`, `distinct`, `partition`, `max`, `min`, `sum`, `arrayDiff`, `range`, `sort`, `multiSort`, and `Order`. The existing object-comparison helper remains available as `diff`.

### Data transformation helpers

`partition(iterable, predicate)` and `Linq.Partition(predicate)` traverse their source once and immediately return `[matching, nonMatching]` arrays. Root object utilities include `equals`, `merge`, `pick`, and `omit`; `merge` recursively combines object values into a new result, while `pick` and `omit` return shallow copies of own enumerable properties and are also available on `Objects`. `camelCase`, `snakeCase`, and `kebabCase` normalize common separators while preserving Unicode letters.

`debounce`, `throttle`, `sleep`, `negate`, and `formToJson` are exported from the package root; `formToJson` converts `FormData` fields into an object. `retry` requires a non-negative `retries` count of additional attempts after the initial call, and its callback receives `(signal, attempt)`. Optional `delay` (a number or `(attempt, error) => milliseconds`) and `shouldRetry(error, attempt)` settings control waits and error policy. An `AbortSignal` is passed to the callback and cancels pending waits.

### tryCatch

`tryCatch` wraps a synchronous or asynchronous function and returns an `Either`. Use `raise` to handle a specific error type.

```typescript
import { raise, tryCatch } from "sidekicker";

const parseJson = tryCatch(
    (text: string) => JSON.parse(text) as unknown,
    raise(SyntaxError, (error) => error.message),
);

const result = parseJson('{"active":true}');
if (result.isSuccess()) {
    console.log(result.success); // { active: true }
} else {
    console.error(result.error);
}
```

## Tooling and runtimes

The project uses Vite+ as its integrated toolchain: Oxlint for linting, Oxfmt for formatting, Vitest for tests, and `vp pack` (tsdown/Rolldown) for the library build. The toolchain requires Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`; the repository pins Node.js 24.18.0 and npm 11.16.0 with Volta.

```sh
npm install
npm run check       # Oxfmt, Oxlint, and type-aware checks
npm run typecheck   # TypeScript 7 compiler
npm test
npm run test:coverage # Vitest V8 coverage with enforced thresholds
npm run build
npm run bench
```

`npm run bench` rebuilds the package, compiles an internal benchmark entry for `Dict`, verifies equivalent outputs, then compares the optimized library functions with their former map/reduce or copying implementations at small and large input sizes. It uses three warmups and seven alternating samples and reports medians without timing thresholds; treat the results as local diagnostics, not universal performance guarantees.

The build emits ESM (`dist/index.js`), CommonJS (`dist/index.cjs`), and format-matched declaration files. Deno and Bun both consume the same ESM build; separate runtime-specific bundles are unnecessary. `qs` remains an external runtime dependency and is resolved through `deno.json` for Deno.

The Deno build and test tasks invoke Vite+ under Node explicitly because the toolchain uses Node-specific APIs; Deno runs the shared ESM output.

```sh
npm run smoke:node

bun run build
npm run smoke:bun

deno task build
deno task test
deno task smoke
```

Run each smoke command after building for that runtime. `npm run smoke:node`, `npm run smoke:bun`, and `npm run smoke:deno` are convenience scripts; the Deno task is also available as `deno task smoke`.
