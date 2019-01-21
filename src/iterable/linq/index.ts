import { Linqs } from "Linqs";
import { OrdersRules } from "OrderByParameters";
import { WhereOperator } from "WhereOperator";
import concat from "./concat";
import GroupBy from "./GroupBy";
import Map from "./map";
import OrderBy from "./OrderBy";
import Paginate from "./Paginate";
import uniq from "./uniq";
import uniqBy from "./uniqBy";
import Where from "./Where";

const sum = (key: string, array: any) =>
    array.reduce((acc: number, el: any) => {
        return (acc += el[key]);
    }, 0);

export function Linq<T>(array: T[]) {
    const functions: Function[] = [];
    const linqs: Linqs<T> = {
        average(key: string) {
            const arr = linqs.get();
            return sum(key, linqs.get()) / arr.length;
        },
        count: () => linqs.get().length,
        // @ts-ignore
        countBy: (fn: Function) => linqs.get().filter(fn).length,
        get: (): T[] => {
            if (array.length === 0) {
                return [];
            }
            return functions.reduce((acc, curr) => curr(acc), array);
        },
        groupBy: (key: string) => {
            functions.push(GroupBy(key));
            return linqs.get;
        },
        head: (): T => linqs.get()[0],
        ifEmpty: (value: T | T[]) => {
            const values = linqs.get();
            return values.length === 0 ? value : values;
        },
        join: (toConcat: T[]) => {
            functions.push(concat(toConcat));
            return linqs;
        },
        map: (fn: Function): Linqs<T> => {
            functions.push(Map(fn));
            return linqs;
        },
        orderBy: (key: string, rules?: OrdersRules) => {
            functions.push(OrderBy(key, rules));
            return linqs;
        },
        paginate: (range: number, page: number = 0) => {
            functions.push(Paginate(range, page));
            return linqs;
        },
        reverse: () => {
            functions.push((arr: T[]) => arr.reverse());
            return linqs;
        },
        select: (): T[] => linqs.get(),
        sum: (key: string) => {
            return sum(key, linqs.get());
        },
        tail: (): T => [...linqs.get()].slice(-1)[0],
        uniq: () => {
            functions.push(uniq());
            return linqs;
        },
        uniqBy: (key: string) => {
            functions.push(uniqBy(key));
            return linqs;
        },
        where: (conditions: WhereOperator): Linqs<T> => {
            functions.push(Where(conditions));
            return linqs;
        },
    };
    return Object.freeze(linqs);
}
