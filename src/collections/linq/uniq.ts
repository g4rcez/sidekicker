import { uniq as rUniq } from "ramda";

const uniq = () => (array: any[]) => rUniq(array);
export default uniq;
