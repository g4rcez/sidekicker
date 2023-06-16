# sidekicker

# Methods

## tryCatch

A simple implementation of tryCatch, inspired in Java Exceptions+TryCatch.

```typescript
const sum = tryCatch(
    (x: number) => {
        if (x === 1) throw new CustomError()
        if (x === 2) throw () => {
        };
        if (x === 3) throw "==>"
        return 1 + 1
    },
    // Will call this function if the throw==CustomError
    exception(CustomError, (e) => `THIS IS A ${e.name}`),
    // Will call this function if throw a function
    exception(Function, (e) => `THIS IS A __${e.constructor.name}__ ERROR`),
    // Will call this function if throw a string
    exception(String, (e) => `${e} string error`),
)
```