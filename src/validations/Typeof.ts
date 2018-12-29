export const isString = (value: any) => {
    return typeof value === "string" || value instanceof String;
};

export const isNumber = (value: any) => {
    if (typeof value === "number") {
        return true;
    }
    return value instanceof Number || Number.isFinite(value);
};

export const isFunction = (fn: any) => {
    return typeof fn === "function";
};

export const isJsonObject = (obj: any) => {
    try {
        JSON.parse(obj);
        return true;
    } catch (error) {
        return false;
    }
};
