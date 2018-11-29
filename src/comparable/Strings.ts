const equals = (string: string, compare: string) => {
  return string === compare;
};

const equalsCaseInsensitive = (string: string, compare: string) => {
  return string.toLowerCase() === compare.toLowerCase();
};

const firstAlphabeticalOrder = (first: string, second: string, caseSensitive: boolean = true) => {
  if (caseSensitive) {
    return first < second;
  }
  return first.toLowerCase() < second.toLowerCase();
};

const firstAlphabeticalOrderInsensitive = (first: string, second: string) => {
  return firstAlphabeticalOrder(first, second, false);
};
const firstAlphabeticalOrderSensitive = (first: string, second: string) => {
  return firstAlphabeticalOrder(first, second);
};

export default {
  equals,
  equalsCaseInsensitive,
  firstAlphabeticalOrder,
  firstAlphabeticalOrderSensitive,
  firstAlphabeticalOrderInsensitive,
};
