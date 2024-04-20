export type Nullable<T> = T | null;

export type Fn = (...a: any[]) => any

export type Unary = (a: any) => any;

export type LooseString<T extends string> = T | Omit<string, T>

export type Merge<T> = { [K in keyof T]: T[K] } & {}

export type Override<Source, New> = Omit<Source, keyof New> & New

export type Equals<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
        (<T>() => T extends Y ? 1 : 2) ? true : false;

export type StringToTuple<S extends string> =
    S extends `${infer Char}${infer Rest}`
        ? [Char, ...StringToTuple<Rest>]
        : [];

export type Length<S extends string> = StringToTuple<S>["length"];

export type IsUnion<T, U = T> = U extends T ? [T] extends [U] ? false : true : never;