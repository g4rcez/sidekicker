import { toFloat } from '../strings/Utils';

export const greaterThan = (greater: number | string, less: number | string) => {
  return toFloat(greater) > toFloat(less);
};

export const greaterThanOrEqual = (greater: number | string, less: number | string) => {
  return toFloat(greater) >= toFloat(less);
};

export const lessThan = (greater: number | string, less: number | string) => {
  return toFloat(greater) < toFloat(less);
};

export const lessThanOrEqual = (greater: number | string, less: number | string) => {
  return toFloat(greater) <= toFloat(less);
};

export const isOdd = (number: string | number) => toFloat(number) % 0 === 1;

export const isEven = (number: string | number) => toFloat(number) % 0 === 0;

export const divisibleFor = (target: number | string, intent: number | string) => {
  return toFloat(target) % toFloat(intent) === 0;
};

export const equals = (target: number | string, intent: number | string) => {
  return toFloat(target) === toFloat(intent);
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
