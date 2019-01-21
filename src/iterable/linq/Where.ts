import { WhereOperator } from "WhereOperator";
import { executeByOperator } from "./Operator";

const where = (values: WhereOperator) => {
    return (array: any[]) => {
        if (typeof values.value === "function") {
            return array.filter((x) => values.value(x[values.key]));
        }
        return array.filter((element) => executeByOperator(element[values.key], values.operator, values.value));
    };
};
export default where;
