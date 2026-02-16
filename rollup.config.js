import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import scss from 'rollup-plugin-scss'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/vue-agentation.umd.js',
        format: 'umd',
        name: 'VueAgentation',
        exports: 'named',
        globals: {
          vue: 'Vue'
        }
      },
      {
        file: 'dist/vue-agentation.esm.js',
        format: 'esm'
      }
    ],
    external: ['vue'],
    plugins: [
      resolve({
        extensions: ['.js', '.vue']
      }),
      commonjs(),
      vue({
        css: false
      }),
      scss({
        output: true,
        outputStyle: 'compressed',
        fileName: 'vue-agentation.css'
      })
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/vue-agentation.umd.min.js',
      format: 'umd',
      name: 'VueAgentation',
      exports: 'named',
      globals: {
        vue: 'Vue'
      },
      sourcemap: false
    },
    external: ['vue'],
    plugins: [
      resolve({
        extensions: ['.js', '.vue']
      }),
      commonjs(),
      vue({
        css: false
      }),
      scss({
        output: false
      }),
      terser()
    ]
  }
]
