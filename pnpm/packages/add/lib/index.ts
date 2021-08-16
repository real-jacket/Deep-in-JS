import { add as _add } from 'lodash';

export function add(num1: number, num2: number) {
  return _add(num1, num2);
}

export function addMultiple(...numbers: number[]): number {
  return numbers.reduce((pre, cur) => pre + cur);
}
