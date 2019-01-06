const map = (fn: Function) => (array: any[]) => array.map((...x) => fn(...x));
export default map;
