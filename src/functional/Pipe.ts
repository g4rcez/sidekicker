export const rightPipe = (...fns: Function[]) => fns.reduce((f, g) => (...args: any) => g(f(...args)));

export const leftPipe = (...fns: Function[]) => fns.reduce((f, g) => (...args: any) => f(g(...args)));

export default { right: rightPipe, left: leftPipe };
