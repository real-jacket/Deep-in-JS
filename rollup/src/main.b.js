import { version } from '../package.json';
import helloWorld from './foo.js';
import barLog from './bar.js';
import { extend } from 'lodash-es';

const a = {
  A: 'a',
};

const b = extend(a, { b: 'B' });

console.log(b);

export default function () {
  console.log('versionb: ' + version);
}

export const hello = () => {
  console.log(helloWorld);
};

export const bar = () => {
  console.log(barLog);
};
