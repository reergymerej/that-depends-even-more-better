#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const thatDependsJS = require('that-depends-js')

const pattern = '/Users/jeremygreer/code/work/onq-web/src/**/*.js'
const files = glob.sync(pattern)

const getImports = (extension, file) => {
  switch (extension) {
  case '.js':
    return thatDependsJS(file)
  default:
    throw new Error(`"${extension}" is not a supported file type."`)
  }
}

const resultMap = {}

files.forEach(filepath => {
  const file = fs.readFileSync(filepath, 'utf8')
  const extension = path.extname(filepath)
  const imports = getImports(extension, file)
  resultMap[filepath] = imports
})

// Do something with the results.
if (require.main === module) {
  console.log(resultMap) // eslint-disable-line no-console
} else {
  return resultMap
}
