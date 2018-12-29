const Factorial = (target: number) => {
    return Array(target)
        .fill(1)
        .map((x, i) => i + 1)
        .reduce((acc, el) => acc * el);
};

export default Factorial;
