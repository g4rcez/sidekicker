import Alphabetical from "../../sort/Alphabetical";
import orderNumber from "../../sort/Number";
import { OrdersRules } from "OrderByParameters";

interface ITypeCoersion {
    number: Function;
    arrays: Function;
    [key: string]: Function;
}

const typeCoersion: ITypeCoersion = {
    arrays: (rules: OrdersRules) => (x: Array<any>, y: Array<any>) => {
        if (rules && rules.reverseOrder) {
            return x.length < y.length;
        }
        return x.length > y.length;
    },
    number: () => orderNumber,
    string: (rules: OrdersRules) => (x: string, y: string) => {
        if (rules && rules.caseSensitive) {
            return Alphabetical.sensitive(x, y);
        }
        return Alphabetical.insensitive(x, y);
    },
};

const orderBy = (key: string, rules?: OrdersRules) => (array: any[]) => {
    if (array.length === 0) {
        return [];
    }
    const type = typeof array[0][key];
    const organizer = typeCoersion[type](rules);
    const newArray = [...array].sort((a, b) => organizer(a[key], b[key]));
    if (rules && rules.reverseOrder) {
        return newArray.reverse();
    }
    return newArray;
};

export default orderBy;
