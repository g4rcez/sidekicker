const findByKey = (prop: string, object: any): any => {
  for (let x of Object.keys(object)) {
    if (prop === x) {
      return {
        [x]: object[x],
      };
    }
    if (typeof object[x] === 'object' || Array.isArray(object[x])) {
      return findByKey(prop, object[x]);
    }
  }
};
