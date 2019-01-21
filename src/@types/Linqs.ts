import { WhereOperator } from "./WhereOperator";
import { OrdersRules } from "./OrderByParameters";

export type Linqs<T> = {
    average(key: string): number;
    count(): number;
    countBy(condition: Function): number;
    get(): T[];
    groupBy(key: string): Function;
    head(): T;
    ifEmpty(defaultValue: T | T[]): T | T[];
    join(array: T[]): Linqs<T>;
    map(fn: Function): Linqs<T>;
    orderBy(key: string, rules?: OrdersRules): Linqs<T>;
    paginate(range: number, page: number): Linqs<T>;
    reverse(): Linqs<T>;
    select(): T[];
    sum(key: string): number;
    tail(): T;
    uniq(): Linqs<T>;
    uniqBy(key: string): Linqs<T>;
    where(conditions: WhereOperator): Linqs<T>;
};
