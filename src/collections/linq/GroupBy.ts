const groupBy = (key: string) => (array: any[]) => {
    return array.reduce((accumulator, element) => {
        const name = element[key];
        if (accumulator[name]) {
            accumulator[name] = [...accumulator[name], element];
        } else {
            accumulator[name] = [element];
        }
        return accumulator;
    }, {});
};

export default groupBy;
