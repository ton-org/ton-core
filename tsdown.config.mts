import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  unbundle: true,
  sourcemap: true,
  treeshake: false,
  clean: true,
  platform: 'neutral',
  tsconfig: 'tsconfig.build.json',
  inputOptions: {
    onwarn: (log, handler) => {
      handler(log)

      if (log.code === 'MISSING_EXPORT') {
        // Throw an error whenever an exported type
        // is not explicitly declared using `export { type MyType }`
        throw new Error(log.code);
      }
    },
  },
})