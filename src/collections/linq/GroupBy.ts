const groupBy = (key: string) => (array: any[]) => {
  const group: any = {};
  array.forEach((x) => {
    const name = x[key];
    if (group[name]) {
      group[name] = [...group[name], x];
    } else {
      group[name] = [x];
    }
  });
  return group;
};

export default groupBy