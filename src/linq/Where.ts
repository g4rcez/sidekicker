import { WhereOperator } from "WhereOperator";
import { executeByOperator } from "./Operator";

const where = (values: { key: string; operator: WhereOperator; value: any }) => {
	return (array: any[]) => {
		const key = values.key;
		if (typeof values.value === "function") {
			return array.filter((x) => values.value(x[key]));
		}
		return array.filter((element) => executeByOperator(element[key], values.operator, values.value));
	};
};
export default where;
