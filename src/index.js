#!/usr/bin/env node

const glob = require('glob')

// find files (of some type)
const pattern = '/Users/jeremygreer/code/work/onq-web/src/**/*.js'
const files = glob.sync(pattern)
console.log(files)

// Get imported files.


// Do something with the results.
//
