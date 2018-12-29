import { executeByOperator } from "./Operator";
import { WhereOperator } from "../../types/WhereOperator";

const where = (values: WhereOperator) => (array: any[]) =>
    array.filter((element) => executeByOperator(element[values.key], values.operator, values.value));

export default where;
