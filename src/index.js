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

const run = () => {
  const resultMap = {}
  files.sort().forEach(filepath => {
    const file = fs.readFileSync(filepath, 'utf8')
    const extension = path.extname(filepath)
    const imports = getImports(extension, file)
    resultMap[filepath] = imports
  })
  return resultMap
}

if (require.main === module) {
  const result = run()
  console.log(result) // eslint-disable-line no-console
}

const addImports = (withImports) => {
  const fixed = {
  }

  Object.keys(withImports).forEach(key => {
    fixed[key] = {
      imports: withImports[key],
    }
  })

  return fixed
}

const addDependents = (withImports) => {
  const fixed = {}

  Object.keys(withImports).forEach(key => {
    const { imports } = withImports[key]

    // If we recurse, we may have circular dependencies.  :D
    // We're merging with what's there because we may have built it when adding
    // the dependents.
    fixed[key] = fixed[key] || {}
    fixed[key].imports = fixed[key].imports || []
    fixed[key].dependents = fixed[key].dependents || []

    // Each import means this is a dependent of the imported file.
    fixed[key].imports = fixed[key].imports.concat(...imports)

    imports.map(i => {
      // key is a dependent of i
      fixed[i] = fixed[i] || {}
      fixed[i].dependents = fixed[i].dependents || []
      fixed[i].dependents.push(key)
    })
  })

  return fixed
}

module.exports = {
  run,
  addImports,
  addDependents,
}
