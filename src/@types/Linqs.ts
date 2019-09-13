import { WhereOperator } from "./WhereOperator";
import { OrdersRules } from "./OrderByParameters";

export type Linqs<T> = {
	Average(key: string): number;
	Count(): number;
	CountBy(condition: Function): number;
	Get(): T[];
	GroupBy(key: string): Function;
	Head(): T;
	IfEmpty(defaultValue: T | T[]): T | T[];
	Join(array: T[]): Linqs<T>;
	Map(fn: Function): Linqs<T>;
	OrderBy(key: string, rules?: OrdersRules): Linqs<T>;
	Paginate(range: number, page: number): Linqs<T>;
	Reverse(): Linqs<T>;
	Select(): T[];
	Sum(key: string): number;
	Tail(): T;
	Uniq(): Linqs<T>;
	UniqBy(key: string): Linqs<T>;
	Where(key: string, operator: WhereOperator, value: any): Linqs<T>;
};
