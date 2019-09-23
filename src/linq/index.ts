import { Linqs } from "../@types/Linqs";
import { OrdersRules } from "../@types/OrderByParameters";
import { WhereOperator } from "../@types/WhereOperator";
import concat from "./concat";
import GroupBy from "./GroupBy";
import Map from "./map";
import OrderBy from "./OrderBy";
import Paginate from "./Paginate";
import uniq from "./uniq";
import uniqBy from "./uniqBy";
import Where from "./Where";
import Math from "../math";

const sum = (key: string, array: any) => array.reduce((acc: number, el: any) => Math.sum(el[key], acc), 0);

type FilterCallback = <T>(value: T, index: number, array: T[]) => boolean;
export function Linq<T>(array: T[]): Linqs<T> {
	const functions: Function[] = [];
	const linqs: Linqs<T> = {
		Average(key: string) {
			const arr = linqs.Get();
			return sum(key, arr) / arr.length;
		},
		Count: () => linqs.Get().length,
		CountBy: (fn: FilterCallback) => linqs.Get().filter(fn).length,
		Get: (): T[] => {
			if (array.length === 0) {
				return [];
			}
			return functions.reduce((acc, curr) => curr(acc), array);
		},
		GroupBy: (key: string) => {
			functions.push(GroupBy(key));
			return linqs.Get;
		},
		Head: (): T => linqs.Get()[0],
		IfEmpty: (value: T | T[]) => {
			const values = linqs.Get();
			return values.length === 0 ? value : values;
		},
		Join: (toConcat: T[]) => {
			functions.push(concat(toConcat));
			return linqs;
		},
		Map: (fn: Function): Linqs<T> => {
			functions.push(Map(fn));
			return linqs;
		},
		OrderBy: (key: string, rules?: OrdersRules) => {
			functions.push(OrderBy(key, rules));
			return linqs;
		},
		Paginate: (range: number, page = 0) => {
			functions.push(Paginate(range, page));
			return linqs;
		},
		Reverse: () => {
			functions.push((arr: T[]) => arr.reverse());
			return linqs;
		},
		Select: (): T[] => linqs.Get(),
		Sum: (key: string) => {
			return sum(key, linqs.Get());
		},
		Tail: (): T => {
			const arr = linqs.Get();
			return arr[arr.length - 1];
		},
		Uniq: () => {
			functions.push(uniq());
			return linqs;
		},
		UniqBy: (key: string) => {
			functions.push(uniqBy(key));
			return linqs;
		},
		Where: (key: string, operator: WhereOperator, value: any): Linqs<T> => {
			functions.push(Where({ key, operator, value }));
			return linqs;
		},
	};
	return linqs;
}

export default Linq;
