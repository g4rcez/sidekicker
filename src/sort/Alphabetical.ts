import Strings from '../comparable/Strings';

const sort = (sensitive: boolean = false, array: string[]) => {
  if (sensitive) {
    return array.sort((a, b) => {
      if (Strings.equals(a, b)) {
        return 0;
      }
      return Strings.firstAlphabeticalOrderSensitive(a, b) ? -1 : 1;
    });
  }
  return array.sort((a, b) => {
    if (Strings.equalsCaseInsensitive(a, b)) {
      return 0;
    }
    return Strings.firstAlphabeticalOrderInsensitive(a, b) ? -1 : 1;
  });
};
export default sort;
