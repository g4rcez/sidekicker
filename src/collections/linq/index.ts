import GroupBy from './GroupBy';
import Paginate from './Paginate';
import Where from './Where';
import WhereOperator from '../../types/WhereOperator';
import Linqs from '../../types/Linqs';
import OrderByParameters from '../../types/OrderByParameters';
import OrderBy from './OrderBy';

const Linq = (array: any[]) => {
  const functions: Function[] = [];
  const linqs: Linqs = {
    where: (conditions: WhereOperator): Linqs => {
      functions.push(Where(conditions));
      return linqs;
    },
    paginate: (range: number, page: number = 0) => {
      functions.push(Paginate(range, page));
      return linqs;
    },
    groupBy: (key: string) => {
      functions.push(GroupBy(key));
      return linqs.execute;
    },
    orderBy: (key: string, rules?: OrderByParameters) => {
      functions.push(OrderBy(key, rules));
      return linqs;
    },
    execute: (): any[] => functions.reduce((acc, curr) => curr(acc), array),
    run: () => linqs.execute(),
  };
  return Object.freeze(linqs);
};

export default Linq;
