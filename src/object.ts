export const has = <T extends {}, K extends keyof T>(o: T, k: K): k is K =>
    Object.prototype.hasOwnProperty.call(o, k);

export const keys = <T extends {}>(t: T) => Object.keys(t) as Array<keyof T>;

