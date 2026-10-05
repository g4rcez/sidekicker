type TransformResult<Fn extends (...args: never[]) => unknown, E> =
    ReturnType<Fn> extends Promise<infer Result> ? Promise<Either<E, Result>> : Either<E, ReturnType<Fn>>;

const n = undefined as never;

export class Either<E, S> {
    private constructor(
        public error: E,
        public success: S,
    ) {}

    public static error<E1>(this: void, e: E1) {
        return new Either<E1, never>(e, n);
    }

    public static success<S1>(this: void, e: S1) {
        return new Either<never, S1>(n, e);
    }

    public static transform<Fn extends (...args: never[]) => unknown, E>(
        fn: Fn,
    ): (...params: Parameters<Fn>) => TransformResult<Fn, E> {
        return (...params) => {
            try {
                const result = fn(...params);
                if (result instanceof Promise) {
                    return result.then(Either.success).catch(Either.error) as unknown as TransformResult<Fn, E>;
                }
                return Either.success(result) as unknown as TransformResult<Fn, E>;
            } catch (error) {
                // E is caller-declared; this method does not validate thrown values.
                return Either.error(error) as unknown as TransformResult<Fn, E>;
            }
        };
    }

    public isSuccess(): this is Either<never, S> {
        return this.success !== undefined;
    }

    public isError(): this is Either<E, never> {
        return this.error !== undefined;
    }
}
