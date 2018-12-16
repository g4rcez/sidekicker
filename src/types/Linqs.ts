import { WhereOperator } from "./WhereOperator";
import { OrdersRules } from "./OrderByParameters";

export type Linqs = {
    where(conditions: WhereOperator): Linqs;
    paginate(range: number, page: number): Linqs;
    groupBy(key: string): Function;
    orderBy(key: string, rules?: OrdersRules): Linqs;
    execute(): any[];
    run(): any[];
};
