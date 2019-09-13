import { WhereOperator } from "WhereOperator";
import { executeByOperator } from "./Operator";
import Filter from "../iterable/Filter";

const where = (values: { key: string; operator: WhereOperator; value: any }) => {
	return (array: any[]) => {
		const key = values.key;
		if (typeof values.value === "function") {
			return Filter(array, (x: any) => values.value(x[key]));
		}
		return Filter(array, (element: any) => executeByOperator(element[key], values.operator, values.value));
	};
};
export default where;
