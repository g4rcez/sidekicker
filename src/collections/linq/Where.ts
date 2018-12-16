import { executeByOperator } from "./Operator";
import { WhereOperator } from "../../types/WhereOperator";

const where = (values: WhereOperator) => {
    return (array: any[]) =>
        array.filter((element) => {
            return executeByOperator(element[values.key], values.operator, values.value);
        });
};

export default where;
