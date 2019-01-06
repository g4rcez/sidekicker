import GroupBy from "./GroupBy";
import Paginate from "./Paginate";
import Where from "./Where";
import { WhereOperator } from "../../types/WhereOperator";
import { Linqs } from "../../types/Linqs";
import { OrdersRules } from "../../types/OrderByParameters";
import OrderBy from "./OrderBy";
import Map from "./map";
import concat from "./concat";

const sum = (key: string, array: any) =>
    array.reduce((acc: number, el: any) => {
        return (acc += el[key]);
    }, 0);

export function Linq<T>(array: T[]) {
    const functions: Function[] = [];
    const linqs: Linqs<T> = {
        average: (key: string) => {
            const arr = linqs.get();
            return sum(key, linqs.get()) / arr.length;
        },
        get: (): T[] => functions.reduce((acc, curr) => curr(acc), array),
        groupBy: (key: string) => {
            functions.push(GroupBy(key));
            return linqs.get;
        },
        head: (): T => linqs.get()[0],
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
            functions.push((array: T[]) => array.reverse());
            return linqs;
        },
        select: (): T[] => linqs.get(),
        sum: (key: string) => {
            return sum(key, linqs.get());
        },
        tail: (): T => linqs.get().slice(-1)[0],
        where: (conditions: WhereOperator): Linqs<T> => {
            functions.push(Where(conditions));
            return linqs;
        },
    };
    return Object.freeze(linqs);
}
