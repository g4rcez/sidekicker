export const even = (n: number) => n % 2 === 0;

export const odd = (n: number) => n % 2 === 1;

export const inc = (n: number) => n + 1;

export const dec = (n: number) => n - 1;

export const clamp = (min: number, x: number, max: number) => Math.min(Math.max(x, min), max);

