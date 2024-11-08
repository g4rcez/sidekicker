import { parse, stringify } from "qs";

export const trailingPaths = (str: string) => str.replace(/\/+$/g, "");

export const joinPathname = (baseURL: string, ...urls: string[]) => urls.reduce((acc, el) => trailingPaths(acc) + "/" + el.replace(/^\/+/, ""), baseURL);

export const qsParseOptions = {
    allowDots: true,
    charset: "utf-8",
    parseArrays: true,
    plainObjects: true,
    charsetSentinel: true,
    allowPrototypes: false,
    depth: Number.MAX_SAFE_INTEGER,
    arrayLimit: Number.MAX_SAFE_INTEGER,
    parameterLimit: Number.MAX_SAFE_INTEGER
} as const;

export const queryStringFromUrl = (url: string) => parse(url, qsParseOptions);

export const toQueryString = <T extends {}>(obj: T) => stringify(obj, qsParseOptions);

export const Url = { qs: toQueryString, qsToObject: queryStringFromUrl, join: joinPathname, trailingPaths };