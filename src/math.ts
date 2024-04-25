export const even = (n: number) => n % 2 === 0;

export const odd = (n: number) => n % 2 === 1;

export const inc = (n: number) => n + 1;

export const dec = (n: number) => n - 1;

export const clamp = <M1 extends number, M2 extends number, M3 extends number>(min: M1, mid: M2, max?: M3): number => {
    if (!max) return Math.max(min, mid) === mid ? min : mid;
    if (Math.min(min, mid) === min) return mid;
    return Math.max(min, max) === min ? max : min;
};
