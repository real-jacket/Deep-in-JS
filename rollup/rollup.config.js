import json from 'rollup-plugin-json';
import * as path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import myHello from './plugin/rollup-plugin-my-hello'

export default {
  input: {
    main: 'src/main.js',
    b: 'src/main.b.js',
  },
  output: {
    entryFileNames: 'entry-[name].js',
    dir: 'output',
    format: 'es',
    name: '[name].js',
    // compact: true,
    manualChunks: {
      lodash: ['lodash-es'],
      foo: [
        path.resolve(__dirname, './src/foo.js'),
        path.resolve(__dirname, './src/bar.js'),
      ],
    },
    sourcemap: true,
    // plugins: [terser()],
    // paths: {
    //   'lodash-es':
    //     'https://cdn.jsdelivr.net/npm/lodash-es@4.17.20/lodash.min.js',
    // },
  },
  plugins: [json(), nodeResolve(), myHello()],
  // external: ['lodash-es'],
};
