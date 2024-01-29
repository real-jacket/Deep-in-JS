export var counter = 0;
import { odd } from './odd.mjs';
export function even(n) {
  counter++;
  return n === 0 || odd(n - 1);
}

even(10);

console.log('counter: ', counter);
