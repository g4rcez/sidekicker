export default function Map<T>(array: T[], fn: Function) {
	if (array && array.length === 0) {
		return [];
	}
	const length = array.length;
	const mapped: T[] = [];
	for (let i = 0; i !== length; i++) {
		if (fn(array[i], i, array)) {
			mapped.push(array[i]);
		}
	}
	return mapped;
}
