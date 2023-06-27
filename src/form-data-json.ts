import { parse } from "qs";
import { qsParseOptions } from "./url";

type Recursive<T, Key extends keyof T> =
    Key extends string
        ? T[Key] extends Date
            ? Key
            : T[Key] extends Record<string, any>
                ? | `${Key}.${Recursive<T[Key], Exclude<keyof T[Key], keyof any[]>> & string}`
                | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
                : never
        : never;

type NullToUndefined<T> = T extends null ? undefined : T;

type RecNTU<T> = {
    [K in keyof T]: T[K] extends {} ? RecNTU<T[K]> : T[K] extends any[] ? RecNTU<T[K]> : NullToUndefined<T[K]>;
};

export const formToJson = <T extends any>(formData: FormData): RecNTU<T> => {
    const urlSearchParams = new URLSearchParams(formData as any);
    return parse(urlSearchParams.toString(), qsParseOptions) as never;
};