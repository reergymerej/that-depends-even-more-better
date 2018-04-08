const fs = require('fs')
const path = require('path')
const glob = require('glob')
const thatDependsJS = require('that-depends-js')
const thatDependsSCSS = require('that-depends-scss')

const pattern = '/Users/jeremygreer/code/work/onq-web/src/**/*.{js,scss}'
const files = glob.sync(pattern)

const getImports = (extension, file) => {
  switch (extension) {
  case '.js':
  case '.jsx':
    return thatDependsJS(file)
  case '.scss':
    return thatDependsSCSS(file)
  default:
    throw new Error(`"${extension}" is not a supported file type."`)
  }
}

const resultMap = {}

files.sort().forEach(filepath => {
  const file = fs.readFileSync(filepath, 'utf8')
  const extension = path.extname(filepath)
  const imports = getImports(extension, file)
  resultMap[filepath] = imports
})

if (require.main === module) {
  console.log(resultMap) // eslint-disable-line no-console
} else {
  return resultMap
}
