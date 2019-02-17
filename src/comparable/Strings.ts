export function strEquals(string: string, compare: string) {
	return string === compare;
}

export function equalsCaseInsensitive(string: string, compare: string) {
	return string.toLowerCase() === compare.toLowerCase();
}

export function firstAlphabeticalOrder(first: string, second: string, caseSensitive: boolean = true) {
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
