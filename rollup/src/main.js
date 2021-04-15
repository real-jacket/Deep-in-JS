import { version } from '../package.json';
import helloWorld from './foo.js';
import virtual from './virtual-module'

console.log(virtual)

export default function () {
  console.log('version: ' + version);
}

export const hello = () => {
  console.log(helloWorld);
};
