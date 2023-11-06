class Nothing<V = never> {
    public constructor(public value: V = undefined as never) {
    }
}

class Err<V> extends Nothing<V> {
}

class Success<V> extends Nothing<V> {
}

export class Either<E, S> {
    private constructor(private _err: Err<E>, private _success: Success<S>) {
    }

    public get error() {
        return this._err.value;
    }

    public get success() {
        return this._success.value;
    }

    public static error<T>(e: T) {
        return new Either(new Err<T>(e), new Nothing());
    }

    public static success<T>(e: T) {
        return new Either(new Nothing(), new Success<T>(e));
    }

    public static isError<T>(either: any): either is Either<T, never> {
        return either instanceof Err;
    }

    public static isSuccess<T>(either: any): either is Either<never, T> {
        return either instanceof Success;
    }

    public static wrap<Fn extends (...a: any[]) => any, E>(fn: Fn) {
        return (...params: Parameters<Fn>): ReturnType<Fn> extends Promise<infer R>
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

    public isError(): this is Either<E, never> {
        return this._err instanceof Err;
    }

    public isSuccess(): this is Either<never, S> {
        return this._success instanceof Success;
    }
}
