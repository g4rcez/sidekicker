import Map from "../iterable/Map";

// @ts-ignore
const map = (fn: Function) => (array: any[]) => Map(array, fn);
export default map;
