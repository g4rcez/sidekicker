# Examples

Build the package, then run the executable examples from the repository root:

```sh
npm run build
node docs/examples.mjs
```

`examples.mjs` checks each result and prints it. It covers LINQ filtering, grouping, joins, and partitioning; array and object helpers; string case conversion; function composition and retry; object paths, FormData parsing, URL paths, and error handling.

The script imports from `../dist/index.js` so it can run against this checkout. In an application, import the same exports from `sidekicker`.
