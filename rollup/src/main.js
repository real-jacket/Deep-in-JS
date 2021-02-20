import { version } from '../package.json';
import helloWorld from './foo.js';

export default function () {
  console.log('version: ' + version);
}

export const hello = () => {
  console.log(helloWorld);
};
