export const rightPipe = (...fns: Function[]) => fns.reverse().reduce((f, g) => (...args: any) => f(g(...args)));

export const leftPipe = (...fns: Function[]) => fns.reverse().reduce((f, g) => (...args: any) => f(g(...args)));

export default { right: rightPipe, left: leftPipe };
