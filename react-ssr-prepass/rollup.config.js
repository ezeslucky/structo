import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json' assert { type: 'json' }

const externalModules = [
  'dns',
  'fs',
  'path',
  'url',
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {})
]

const externalPredicate = new RegExp(`^(${externalModules.join('|')})($|/)`)
const externalTest = (id) => externalPredicate.test(id)

export default {
  input: './src/index.ts',
  onwarn: () => {},
  external: externalTest,
  treeshake: {
    propertyReadSideEffects: false
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src'
    }),
    resolve({
      dedupe: externalModules,
      mainFields: ['module', 'jsnext', 'main'],
      browser: true
    }),
    commonjs({
      ignoreGlobal: true,
      include: /\/node_modules\//
    }),
    babel({
      babelrc: false,
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        '@babel/preset-react'
      ],
      plugins: [
        'babel-plugin-closure-elimination',
        '@babel/plugin-transform-object-assign',
        [
          'babel-plugin-transform-async-to-promises',
          { inlineHelpers: true, externalHelpers: true }
        ]
      ]
    }),
    terser({
      warnings: true,
      ecma: 2019,
      keep_fnames: true,
      compress: false,
      mangle: false,
      output: {
        beautify: true,
        braces: true,
        indent_level: 2
      }
    })
  ],
  output: [
    {
      sourcemap: true,
      freeze: false,
      file: './dist/react-ssr-prepass.es.js',
      format: 'esm'
    },
    {
      sourcemap: true,
      freeze: false,
      file: './dist/react-ssr-prepass.js',
      format: 'cjs'
    }
  ]
}
