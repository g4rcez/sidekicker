const paginate = (range: number, page: number = 0) => {
    return (array: any[]) => {
        return page <= 1 ? array.splice(0, range) : array.splice(page * range, range);
    };
};

export default paginate;
