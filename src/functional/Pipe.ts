export const right = (...fns: Function[]) => fns.reduce((f, g) => (...args: any) => g(f(...args)));

export const left = (...fns: Function[]) => fns.reduce((f, g) => (...args: any) => f(g(...args)));

export default { right, left };
