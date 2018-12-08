import WhereOperator from './WhereOperator';
import OrderByParameters from './OrderByParameters';
export default interface Linqs {
  where(conditions: WhereOperator): Linqs;
  paginate(range: number, page: number): Linqs;
  groupBy(key: string): Function;
  orderBy(key: string, rules?: OrderByParameters): Linqs;
  execute(): any[];
  run(): any[];
}
