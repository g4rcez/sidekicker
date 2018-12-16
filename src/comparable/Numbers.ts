import { toInt } from '../strings/Utils';
export const greaterThan = (greater: number | string, less: number | string) => {
  return toInt(greater) > toInt(less);
};

export const greaterThanOrEqual = (greater: number | string, less: number | string) => {
  return toInt(greater) >= toInt(less);
};

export const lessThan = (greater: number | string, less: number | string) => {
  return toInt(greater) < toInt(less);
};

export const lessThanOrEqual = (greater: number | string, less: number | string) => {
  return toInt(greater) <= toInt(less);
};

export const isOdd = (number: string | number) => toInt(number) % 0 === 1;

export const isEven = (number: string | number) => toInt(number) % 0 === 0;

export const divisibleFor = (target: number | string, intent: number | string) => {
  return toInt(target) % toInt(intent) === 0;
};

export const equals = (target: number | string, intent: number | string) => {
  return toInt(target) === toInt(intent);
};

export default {
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  isOdd,
  isEven,
  divisibleFor,
};
