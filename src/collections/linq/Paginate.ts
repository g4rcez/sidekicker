const paginate = (range: number, page: number = 0) => {
  return (array: any[]) => {
    if (page < 0) {
      return array.splice(range);
    }
    if (page == 1 || page == 0) {
      return array.splice(0, range);
    }
    const expr = page * range;
    return array.splice(expr, range);
  };
};

export default paginate;
