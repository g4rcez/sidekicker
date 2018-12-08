interface genericFunction {
  [key: string]: Function;
}

const generic = (rules: any, value: any, functions: genericFunction) => {
  if (rules) {
    const srcTrue: Boolean[] = [];
    Object.keys(rules).forEach((name: string) => {
      const rule: any = rules[name];
      if (rule) {
        console.log(value, rule, functions[name](value, rule));
        srcTrue.push(functions[name](value, rule));
      }
    });
    return srcTrue.filter(Boolean).length === srcTrue.length;
  }
  return true;
};

export default generic;
