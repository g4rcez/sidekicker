export class Either<E, S> {

    private constructor(public error: E, public success: S) {
    }

    public static error<E>(error: E) {
        return new Either<E, undefined>(error, undefined);
    }

    public static success<S>(success: S) {
        return new Either<undefined, S>(undefined, success);
    }

    public isError(): this is Either<E, undefined> {
        return this.error !== undefined;
    }

    public isSuccess(): this is Either<undefined, S> {
        return this.success !== undefined;
    }

    public wrap<Fn extends (...a: any[]) => any, E>(fn: Fn) {
        return (...params: Parameters<Fn>[]): ReturnType<Fn> extends Promise<infer R>
            ? Promise<Either<E, R>>
            : Either<E, ReturnType<Fn>> => {
            try {
                const result = fn(...params);
                if (result instanceof Promise) {
                    return result.then(Either.success).catch(Either.error) as any;
                }
                return Either.success(result) as any;
            } catch (e) {
                return Either.error(e) as any;
            }
        };
    }
}