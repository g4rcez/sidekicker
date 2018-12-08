import OrderNumber from '../../sort/Number';
import Alphabetical from '../../sort/Alphabetical';
import OrdersRules from '../../types/OrderByParameters';

interface TypeCoersion {
  number: Function;
  [key: string]: Function;
}

const typeCoersion: TypeCoersion = {
  number: (rules: OrdersRules) => (x: number, y: number) => OrderNumber(x, y),
  string: (rules: OrdersRules) => (x: string, y: string) => {
    if (rules && rules.caseSensitive) {
      return Alphabetical.sensitive(x, y);
    }
    return Alphabetical.insensitive(x, y);
  },
};

const orderBy = (key: string, rules?: OrdersRules) => (array: any[]) => {
  const type = typeof array[0][key];
  const organizer = typeCoersion[type](rules);
  const newArray = [...array].sort((a, b) => organizer(a[key], b[key]));
  if (rules && rules.reverseOrder) {
    return newArray.reverse();
  }
  return newArray;
};

export default orderBy;
