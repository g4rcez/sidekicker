import { Either } from "./either";
import { Fn } from "../types/utility.type";

type ErrorTuple<T extends any = any> = [instance: T, handler: (T: T) => any];

type Instance = abstract new (...args: any) => any;

export const exception = <T extends Instance, B>(instance: T, handler: (e: InstanceType<T>) => B): [instance: T, handler: (e: InstanceType<T>) => B] => [instance, handler];

export const tryCatch = <F extends Fn, Cases extends ErrorTuple[]>(fn: F, ...cases: Cases):
    (...p: Parameters<F>) =>
        ReturnType<F> extends Promise<unknown>
            ? Promise<Either<ReturnType<Cases[number][1]>, ReturnType<F>>>
            : Either<ReturnType<Cases[number][1]>, ReturnType<F>> => {
    const map = new WeakMap(cases);
    const catchHandler = (e: any) => {
        const errorHandler = map.get(e?.constructor);
        if (errorHandler) {
            return Either.error(errorHandler(e));
        }
        return Either.error(e);
    };
    const handler: any = (...a: any[]) => {
        try {
            const maybePromise = fn(...a);
            if (maybePromise instanceof Promise) return maybePromise.then(x => Either.success(x)).catch(catchHandler);
            return Either.success(maybePromise);
        } catch (e) {
            return catchHandler(e);
        }
    };
    return handler;
};

