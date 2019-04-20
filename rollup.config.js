import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const name = 'fixerApi';

export default {
  input: './dist/index.browser.js',

  external: [],

  plugins: [
    resolve({ extensions }),

    commonjs(),

    babel({ extensions }),
  ],

  output: [{
    file: pkg.browser,
    format: 'iife',
    name,

    globals: {},
  }],
};
