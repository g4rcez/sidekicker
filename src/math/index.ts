import { Decimal } from "decimal.js";

export const sum = (n1: number, ...ns: number[]) => {
	const decimal = new Decimal(n1);
	if (ns.length === 0) {
		return decimal.toNumber();
	}
	ns.forEach((x) => decimal.add(x));
	return decimal.toNumber();
};

export const toNumber = (str: string | number, precision = 2) => new Decimal(str).toNumber();

export default {
	sum,
	toNumber,
};
