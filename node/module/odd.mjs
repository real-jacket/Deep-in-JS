import { even } from './even.mjs';

debugger;
var xx = even(0);
console.log('xx', xx);
export function odd(n) {
  return n !== 0 && even(n - 1);
}
debugger;
