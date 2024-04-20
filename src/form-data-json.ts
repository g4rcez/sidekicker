import { parse } from "qs";
import { qsParseOptions } from "./url";

type NullToUndefined<T> = T extends null ? undefined : T;

type ParseNullToUndefined<T> = {
    [K in keyof T]: T[K] extends {} ? ParseNullToUndefined<T[K]> : T[K] extends any[] ? ParseNullToUndefined<T[K]> : NullToUndefined<T[K]>;
};

export const formToJson = <T extends any>(formData: FormData): ParseNullToUndefined<T> => {
    const urlSearchParams = new URLSearchParams(formData as any);
    return parse(urlSearchParams.toString(), qsParseOptions) as ParseNullToUndefined<T>;
};
