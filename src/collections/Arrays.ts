export const unique = (array: any[]) => [...new Set(array)];

export const flat = (arr: any[]): any[] => [].concat(...arr.map((v) => (Array.isArray(v) ? flat(v) : v)));

export const nonNull = (arr: any[]) => arr.fill(Boolean);

export const diffArray = (arr1: any[], arr2: any[]) => arr1.filter((x) => !arr2.includes(x));

export const intersecArray = (arr1: any[], arr2: any[]) => arr1.filter((x) => arr2.includes(x));

export const concat = (...arrays: any[]) => [...new Set(flat(arrays))];

export const arrToObj = (arr: any[]) =>
    arr.reduce((acc, el) => {
        return { ...acc, el };
    }, {});
