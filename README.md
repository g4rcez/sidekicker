# sidekicker

# Methods

## tryCatch

A simple implementation of tryCatch, inspired in Java Exceptions+TryCatch.

```typescript
const sum = tryCatch(
    (x: number) => {
        if (x === 1) throw new CustomError();
        if (x === 2) throw () => {};
        if (x === 3) throw "==>";
        return 1 + 1;
    },
    // Will call this function if the throw==CustomError
    exception(CustomError, (e) => `THIS IS A ${e.name}`),
    // Will call this function if throw a function
    exception(Function, (e) => `THIS IS A __${e.constructor.name}__ ERROR`),
    // Will call this function if throw a string
    exception(String, (e) => `${e} string error`),
);
```

# Tooling and runtimes

The project uses Vite+ as its integrated toolchain: Oxlint for linting, Oxfmt for formatting, Vitest for tests, and `vp pack` (tsdown/Rolldown) for the library build. The toolchain requires Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`; the repository pins Node.js 24.18.0 and npm 11.16.0 with Volta.

```sh
npm install
npm run check       # Oxfmt, Oxlint, and type-aware checks
npm run typecheck   # TypeScript 7 compiler
npm test
npm run test:coverage # Vitest V8 coverage with enforced thresholds
npm run build
```

The build emits ESM (`dist/index.js`), CommonJS (`dist/index.cjs`), and format-matched declaration files. Deno and Bun both consume the same ESM build; separate runtime-specific bundles are unnecessary. `qs` remains an external runtime dependency and is resolved through `deno.json` for Deno.

The Deno build task invokes Vite+ under Node explicitly because the builder uses Node-specific APIs; Deno then runs the shared ESM output.

```sh
npm run smoke:node

bun run build
npm run smoke:bun

deno task build
deno task smoke
```

Run each smoke command after building for that runtime. `npm run smoke:node`, `npm run smoke:bun`, and `npm run smoke:deno` are convenience scripts; the Deno task is also available as `deno task smoke`.
