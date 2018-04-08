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

const addImports = (withImports) => {
  const fixed = {}
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
    imports.forEach(i => {
      // key is a dependent of i
      //
      // We may import react-redux from node_modules, but we shouldn't included
      // it unless it's in our set (withImports).
      if (withImports.hasOwnProperty(i)) {
        fixed[i] = fixed[i] || {}
        fixed[i].imports = fixed[i].imports || []
        fixed[i].dependents = fixed[i].dependents || []
        fixed[i].dependents.push(key)
      }
    })
  })
  return fixed
}

const decorate = withBasicImports => {
  return addDependents(addImports(withBasicImports))
}

const run = () => {
  const resultMap = {}
  files.sort().forEach(filepath => {
    const file = fs.readFileSync(filepath, 'utf8')
    const extension = path.extname(filepath)
    const imports = getImports(extension, file)
    resultMap[filepath] = imports
  })
  return decorate(resultMap)
}

const getFilesWithNoImports = (result) => {
  const noImports = []
  Object.keys(result).forEach(x => {
    if (!result[x].imports.length) {
      noImports.push(x)
    }
  })
  return noImports.sort()
}

const logResult = (result) => {
  /* eslint-disable no-console */
  // console.log(result)
  const files = Object.keys(result)
  console.log(`Analyzed ${files.length} files`)

  const filesWithNoImports = getFilesWithNoImports(result)
  console.log(`${filesWithNoImports.length} files with no imports`)
  filesWithNoImports.forEach(x => console.log(x))


  /* eslint-enabled no-console */
}

if (require.main === module) {
  const result = run()
  logResult(result)
}
module.exports = {
  run,
  addImports,
  addDependents,
}
