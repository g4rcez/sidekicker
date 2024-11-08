import type { Fn, Instance } from "../types/utility.type";
import { Either } from "./either";

type ErrorTuple<T extends any = any> = [instance: T, handler: (T: T) => any];

const DEFAULT_CATCH = "default";

export const tryCatch = <F extends Fn, Cases extends ErrorTuple[]>(fn: F, ...cases: Cases):
    (...p: Parameters<F>) =>
        ReturnType<F> extends Promise<any>
            ? Promise<Either<ReturnType<Cases[any][1]>, ReturnType<F>>>
            : Either<ReturnType<Cases[any][1]>, ReturnType<F>> => {
    const instances = new Map(cases);
    const catchHandler = (e: any) => {
        const errorHandler = instances.get(e?.constructor ?? e);
        if (errorHandler) {
            return Either.error(errorHandler(e));
        }
        const defaultHandler = instances.get(DEFAULT_CATCH);
        if (defaultHandler) {
            return Either.error(defaultHandler(e));
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


export const raise =
    <T extends Instance | undefined | null, Return, Handler extends (e: T extends Instance ? InstanceType<T> : T) => Return>
    (instance: T, handler: Handler):
        [instance: T, handler: Handler] => [instance, handler];

export const catchDefault =
    <Return, Handler extends <T extends Error | any>(e: T) => Return>
    (handler: Handler):
        [instance: typeof DEFAULT_CATCH, handler: Handler] => [DEFAULT_CATCH, handler];


tryCatch.raise = raise;
