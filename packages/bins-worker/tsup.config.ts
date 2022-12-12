import { defineConfig } from 'tsup'
import fs from 'fs'

const packages = JSON.parse(fs.readFileSync('package.json').toString()).dependencies

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'node19',
  clean: true,
  noExternal: process.env.DEV ? ['@joshbalfour/bins-graphql-schema'] : Object.keys(packages),
  treeshake: !process.env.DEV,
  minify: false,
})