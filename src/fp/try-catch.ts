import { Fn } from "../types/utility.type";
import { Either } from "./either";

type ErrorTuple<T extends any = any> = [instance: T, handler: (T: T) => any];

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

type Instance = abstract new (...args: any) => any;


export const raise =
    <T extends Instance | undefined | null, Return, Handler extends (e: T extends Instance ? InstanceType<T> : T) => Return>
    (instance: T, handler: Handler):
        [instance: T, handler: Handler] => [instance, handler];

tryCatch.raise = raise;