type GenericFunction = {
    [key: string]: Function;
};

const generic = (rules: any, value: any, functions: GenericFunction) => {
    if (rules) {
        const srcTrue: Boolean[] = [];
        Object.keys(rules).forEach((name: string) => {
            const rule: any = rules[name];
            if (rule) {
                srcTrue.push(functions[name](value, rule));
            }
        });
        return srcTrue.filter(Boolean).length === srcTrue.length;
    }
    return true;
};

export default generic;
