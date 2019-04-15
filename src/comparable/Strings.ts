export function strEquals(str: string, compare: string) {
	return str === compare;
}

export function equalsCaseInsensitive(str: string, compare: string) {
	return str.toLowerCase() === compare.toLowerCase();
}

export function firstAlphabeticalOrder(first: string, second: string, caseSensitive = true) {
	if (caseSensitive) {
		return first < second;
	}
	return first.toLowerCase() < second.toLowerCase();
}

export function firstAlphabeticalOrderInsensitive(first: string, second: string) {
	return firstAlphabeticalOrder(first, second, false);
}

export function firstAlphabeticalOrderSensitive(first: string, second: string) {
	return firstAlphabeticalOrder(first, second);
}

export const strings = {
	equalsCaseInsensitive,
	firstAlphabeticalOrder,
	firstAlphabeticalOrderInsensitive,
	firstAlphabeticalOrderSensitive,
	strEquals,
};
