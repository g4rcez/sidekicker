import { N, L } from "ts-toolbelt";

type Fn = (...a: any[]) => any;

type PipeArgs<Fns extends readonly Fn[], Func extends Fn, Acc extends readonly Fn[] = [], C extends number = 0> = Fns["length"] extends C
    ? Acc
    : PipeArgs<Fns, Fns[C], L.Merge<Acc, [(p: ReturnType<Func>) => ReturnType<Fns[C]>]>, N.Add<C, 1>>;

type PipeReturn<First extends Fn, Last extends Fn> = (...params: Parameters<First>) => ReturnType<Last>;

export const pipe = <A extends Fn, T extends readonly Fn[]>(a: A, ...fns: PipeArgs<T, A>): PipeReturn<A, L.Last<T>> =>
    (fns as Fn[]).reduce(
        (f: Fn, g: Fn) =>
            (...args: unknown[]) =>
                g(f(...args)), (...args: unknown[]) => a(...args));