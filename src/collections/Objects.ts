export function findByKey(prop: string, object: any): any {
    for (let x of Object.keys(object)) {
        if (prop === x) {
            return {
                [x]: object[x],
            };
        }
        if (typeof object[x] === "object" || Array.isArray(object[x])) {
            return findByKey(prop, object[x]);
        }
    }
    return undefined;
}

const isObject = (val: any) => typeof val == "object" && !Array.isArray(val);

export function defaults(defaults: any, values: any) {
    const newValues = { ...values };
    Object.keys(defaults).forEach((some) => {
        const val = defaults[some];
        if (!newValues[some]) {
            if (isObject(val)) {
                newValues[some] = defaults(defaults[some], newValues[some]);
            } else {
                newValues[some] = defaults[some];
            }
        }
    });
    return newValues;
}

export function get(from: object, ...selectors: string[]) {
    const result = [...selectors].map((selected) =>
        selected
            .replace(/\[([^\[\]]*)\]/g, ".$1.")
            .split(".")
            .filter((t) => t !== "")
            .reduce((prev: any, cur) => prev && prev[cur], from),
    );
    return result.length === 1 ? result[0] : result;
}
