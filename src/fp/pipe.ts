import { F, N } from "ts-toolbelt";
import { Fn, Unary } from "../types/utility.type";

type Pipe<
    First extends Fn,
    Fns extends Array<Unary>,
    Acc extends Fn[] = [],
    I extends number = 0
> = Fns["length"] extends I
    ? Acc
    : (
        I extends 0 ?
            Pipe<Fns[I], Fns, [...Acc, (...params: Parameters<First>) => ReturnType<First>], N.Add<I, 1>>
            : Pipe<Fns[I], Fns, [...Acc, (param: ReturnType<Fns[N.Sub<I, 1>]>) => ReturnType<Fns[I]>], N.Add<I, 1>>
        )

type ExtractInfo<
    Fns extends Fn[],
    Transform extends Fn[],
    Acc extends any[] = [],
    I extends number = 0
> = Transform["length"] extends I
    ? Acc
    : ExtractInfo<Fns, Transform, [
        ...Acc,
        {
            index: I;
            received: Fns[I];
            expected: Transform[I];
            test: Parameters<Fns[I]> extends Parameters<Transform[I]> ? true : false;
        }
    ], N.Add<I, 1>>

type HasPipeError<T extends any[]> =
    T extends [infer L, ...infer R]
        ? L extends { test: false }
            ? true
            : HasPipeError<R>
        : false

type GetPipeError<T extends any[], I extends number = 0> =
    T["length"] extends I
        ? undefined
        : T[I] extends { test: false }
            ? T[I]
            : GetPipeError<T, N.Add<I, 1>>

type CreatePipe<Fns extends Fn[], T extends any[]> = HasPipeError<T> extends true
    ? GetPipeError<T> : ((...params: Parameters<Fns[0]>) => ReturnType<Fns[N.Sub<Fns["length"], 1>]>)


export const pipe = <First extends Fn, Second extends Unary, Rest extends F.Narrow<Unary[]>>(first: First, second: Second, ...rest: Rest):
    CreatePipe<
        Pipe<First, [First, Second, ...Rest]>,
        ExtractInfo<
            [First, Second, ...Rest], Pipe<First, [First, Second, ...Rest]
        >
        >> => ([first, second, ...rest] as Fn[]).reduce((acc, fn) => (...args: any[]) => fn(acc(...args))) as any;
