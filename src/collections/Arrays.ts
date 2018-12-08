export const unique = (array: any[]) => [...new Set(array)];

export const flat = (array: any[]): any[] => [].concat(...array.map((v) => (Array.isArray(v) ? flat(v) : v)));
