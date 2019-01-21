const orderNumber = (x: any, y: any): number => {
  if (x === y) {
    return 0;
  }
  return x > y ? 1 : -1;
};

export default orderNumber;
