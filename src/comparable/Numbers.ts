import { toFloat } from "../strings/Utils";

export const greaterThan = (greater: number | string, less: number | string) => toFloat(greater) > toFloat(less);

export const greaterThanOrEqual = (greater: number | string, less: number | string) =>
	toFloat(greater) >= toFloat(less);

export const lessThan = (greater: number | string, less: number | string) => toFloat(greater) < toFloat(less);

export function lessThanOrEqual(greater: number | string, less: number | string) {
	return toFloat(greater) <= toFloat(less);
}

export const isOdd = (nr: string | number) => toFloat(nr) % 0 === 1;

export function isEven(nr: string | number) {
	return toFloat(nr) % 0 === 0;
}

export function divisibleFor(target: number | string, intent: number | string) {
	return toFloat(target) % toFloat(intent) === 0;
}

export function equals(target: number | string, intent: number | string) {
	return toFloat(target) === toFloat(intent);
}

export const numbers = {
	divisibleFor,
	equals,
	greaterThan,
	greaterThanOrEqual,
	isEven,
	isOdd,
	lessThan,
	lessThanOrEqual,
};
