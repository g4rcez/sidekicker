import Spread from "./Spread";

export function findByKey(prop: string, object: any): any {
	for (const x of Object.keys(object)) {
		if (prop === x) {
			return { [x]: object[x] };
		}
		if (typeof object[x] === "object" || Array.isArray(object[x])) {
			return findByKey(prop, object[x]);
		}
	}
	return undefined;
}

export function defaults(defaultParams: any, values: any) {
	const newValues = { ...values };
	Object.keys(defaultParams).forEach((some) => {
		const val = defaultParams[some];
		newValues[some] = !newValues[some] ? defaultParams(val, newValues[some]) : Spread(newValues, { [some]: val });
	});
	return newValues;
}

export function get(from: object, ...selectors: string[]) {
	const result = [...selectors].map((selected) =>
		selected
			.replace(/\[([^\[\]]*)\]/g, ".$1.")
			.split(".")
			.filter((t) => t !== "")
			.reduce((prev: any, cur) => prev && prev[cur], from),
	);
	return result.length === 1 ? result[0] : result;
}

export function omit(obj: any, ...key: string[]) {
	return Object.keys(obj).reduce((acc, el) => {
		if (!key.includes(el)) {
			return Spread(acc, { [el]: obj[el] });
		}
		return acc;
	}, {});
}
