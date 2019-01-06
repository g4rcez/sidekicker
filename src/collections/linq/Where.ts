import { executeByOperator } from "./Operator";
import { WhereOperator } from "../../types/WhereOperator";

const where = (values: WhereOperator) => (array: any[]) => {
    if (typeof values.value === "function") {
        return array.filter((x) => values.value(x[values.key]));
    }
    return array.filter((element) => executeByOperator(element[values.key], values.operator, values.value));
};
export default where;
