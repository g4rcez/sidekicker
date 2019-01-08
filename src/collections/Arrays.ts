export function unique(array: any[]) {
    return [...new Set(array)];
}

export function flat(arr: any[]): any[] {
    return [].concat(...arr.map((v) => (Array.isArray(v) ? flat(v) : v)));
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
    return [...new Set(flat(arrays))];
}

export function arrToObj(arr: any[]) {
    return arr.reduce((acc, el) => ({ ...acc, el }), {});
}
