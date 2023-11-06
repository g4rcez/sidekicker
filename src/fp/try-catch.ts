import { Either } from "./either";
import { Fn } from "../types/utility.type";

type ErrorTuple<T extends any = any> = [instance: T, handler: (T: T) => any];

type Instance = abstract new (...args: any) => any;

type ResultFromInstance<Input extends null | undefined | Instance, Output> = Input extends null ?
    [instance: null, handler: (e: null) => Output]
    : Input extends undefined ? [instance: undefined, handler: (e: undefined) => Output] : [instance: Input, handler: (e: InstanceType<NonNullable<Input>>) => Output]

type HandlerFromInstance<Input extends null | undefined | Instance, Output> = Input extends null ?
    ((e: null) => Output)
    : Input extends undefined ? ((e: undefined) => Output) : ((e: InstanceType<NonNullable<Instance>>) => Output)

export const exception = <T extends Instance | null | undefined, B>(instance: T, handler: HandlerFromInstance<T, B>): ResultFromInstance<T, B> => [instance, handler] as any;

export const tryCatch = <F extends Fn, Cases extends ErrorTuple[]>(fn: F, ...cases: Cases):
    (...p: Parameters<F>) =>
        ReturnType<F> extends Promise<unknown>
            ? Promise<Either<ReturnType<Cases[number][1]>, ReturnType<F>>>
            : Either<ReturnType<Cases[number][1]>, ReturnType<F>> => {
    const internal = cases.filter(x => x[0] !== null && x[0] !== undefined);
    const map = new WeakMap(internal);
    const catchHandler = (e: any) => {
        if (e === null || e === undefined) {
            const handler = cases.find(x => x[0] === e);
            return handler ? Either.error(handler[1](e)) : Either.error(e);
        }
        const errorHandler = map.get(e?.constructor);
        if (errorHandler) {
            return Either.error(errorHandler(e));
        }
        return Either.error(e);
    };
    return function handler(...a: Parameters<typeof fn>) {
        try {
            const maybePromise = fn(...a);
            if (maybePromise instanceof Promise) return maybePromise.then(x => Either.success(x)).catch(catchHandler);
            return Either.success(maybePromise);
        } catch (e) {
            return catchHandler(e);
        }
    } as any;
};

