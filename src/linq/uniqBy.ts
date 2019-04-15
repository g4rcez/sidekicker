import { uniqBy as rUniq } from "ramda";

const uniq = (key: string) => (array: any[]) => rUniq((object: any) => object[key], array);
export default uniq;
