import { executeByOperator } from './Operator';
import WhereOperator from '../../types/WhereOperator';

const where = (operator: WhereOperator) => {
  return (array: any[]) =>
    array.filter((x) => {
      return executeByOperator(x[operator.key], operator.operator, operator.value);
    });
};

export default where;
