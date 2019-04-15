export function spreadSet<T>(set: Set<T>) {
	return <T[]>Array.from(set);
}

export function unique(array: any[]) {
	return spreadSet(new Set(array));
}

export function flat(arr: any[]): any[] {
	return [].concat(...arr.map((v) => (Array.isArray(v) ? flat(v) : v)));
}

export function pluck(arr: any[], ...key: string[]) {
	if (key.length === 1) {
		const get = key[0];
		return arr.map((x) => x[get]);
	}
	return arr.map((x) => {
		return Object.keys(x).reduce((acc, el) => {
			if (key.includes(el)) {
				return { ...acc, [el]: x[el] };
			}
			return acc;
		}, {});
	});
}

export function nonNull(arr: any[]) {
	return arr.fill(Boolean);
}

export function diffArray(arr1: any[], arr2: any[]) {
	return arr1.filter((x) => !arr2.includes(x));
}

export function intersecArray(arr1: any[], arr2: any[]) {
	return arr1.filter((x) => arr2.includes(x));
}

export function concat(...arrays: any[]) {
	return spreadSet(new Set(flat(arrays)));
}

export function arrToObj(arr: any[]) {
	return arr.reduce((acc, el) => ({ ...acc, el }), {});
}
