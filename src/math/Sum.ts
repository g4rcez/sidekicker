const Sum = (...numbers: number[]) => {
    return numbers.reduce((acc, el) => acc + el);
};

const ArraySum = (array: any[], key: string = "value") => {
    return Sum(...array.map((x): number => x[key]));
};

export default ArraySum;
