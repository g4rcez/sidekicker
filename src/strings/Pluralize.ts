export type Plurals = {
	[key: string]: string;
};

export type lenA = number | any[];

export default function Pluralize(text: string, length: lenA, plurals: Plurals, zero?: string, negative?: string) {
	const len = Array.isArray(length) ? length.length : length;
	if (len <= 0) {
		if (negative !== undefined) {
			return negative;
		}
		return zero;
	}
	let strBuilder = text;
	Object.keys(plurals).forEach((x) => {
		if (len > 1) {
			const plural = plurals[x];
			strBuilder = strBuilder.replace(new RegExp(`#{${x}}`, "g"), plural);
		} else {
			strBuilder = strBuilder.replace(new RegExp(`#{${x}}`, "g"), x);
		}
	});
	return strBuilder;
}
