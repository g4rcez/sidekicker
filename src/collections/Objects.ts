export const keyAsValue = (obj: any) =>
  Object.keys(obj).reduce((acc: any, key) => {
    const val = obj[key];
    acc[val] = acc[val] || {};
    acc[val] = key;
    return acc;
  }, {});
