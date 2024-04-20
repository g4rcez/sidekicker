const n = undefined as never;

export class Either<E, S> {
  private constructor(
    public error: E,
    public success: S,
  ) {}

  public static error<E1>(e: E1) {
    return new Either<E1, never>(e, n);
  }

  public static success<S1>(e: S1) {
    return new Either<never, S1>(n, e);
  }

  public static transform<Fn extends (...a: any[]) => any, E>(fn: Fn) {
    return (
      ...params: Parameters<Fn>
    ): ReturnType<Fn> extends Promise<infer R>
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

  public isSuccess(): this is Either<never, S> {
    return this.success !== undefined;
  }

  public isError(): this is Either<E, never> {
    return this.error !== undefined;
  }
}
