export function composeRight(...fns: Function[]) {
    return fns.reduce((f, g) => (...args: any) => g(f(...args)));
}

export function composeLeft(...fns: Function[]) {
    return fns.reduce((f, g) => (...args: any) => f(g(...args)));
}
