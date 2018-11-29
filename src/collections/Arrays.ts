import { groupBy } from 'ramda';

export const unique = (array: any[]) => [...new Set(array)];

interface Group {
  id: string | number;
  list: any[];
  childrenId: string | number;
  reverseLogic: boolean;
}
export const group = ({ id = 'id', list = [], childrenId, reverseLogic = false }: Group) => {
  const group: any = groupBy((x: any) => {
    const areEquals = id === x[childrenId];
    return `${areEquals}`;
  });
  return reverseLogic ? group.false : group.true;
};

export const flat = (arr: any[]): any[] => [].concat(...arr.map((v) => (Array.isArray(v) ? flat(v) : v)));

export const findKey = (obj: any = {}, target: any): any =>
  target in obj
    ? obj[target]
    : Object.values(obj).reduce((acc, val) => {
        if (acc !== undefined) return acc;
        if (typeof val === 'object') return findKey(val, target);
      }, undefined);
