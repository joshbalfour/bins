import { defineConfig } from 'tsup'
import fs from 'fs'

const packages = JSON.parse(fs.readFileSync('package.json').toString()).dependencies

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'node19',
  clean: true,
  noExternal: Object.keys(packages),
  treeshake: true,
  minify: false,
})