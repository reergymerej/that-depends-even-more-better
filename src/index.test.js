const app = require('./')

describe('addImports', () => {
  it('should reshape the data', () => {
    const input = {
      'src/a': [
        'src/b',
        'src/c',
      ],
      'src/b': [],
      'src/c': [],
    }

    const result = app.addImports(input)
    expect(result).toEqual({
      'src/a': {
        imports: [
          'src/b',
          'src/c',
        ],
      },
      'src/b': {
        imports: [],
      },
      'src/c': {
        imports: [],
      },
    })
  })
})

describe('addDependents', () => {
  it('should add dependents', () => {
    const input = {
      'src/a': {
        imports: [
          'src/b',
          'src/c',
        ],
      },
      'src/b': {
        imports: [],
      },
      'src/c': {
        imports: [],
      },
    }

    const result = app.addDependents(input)
    expect(result).toEqual({
      'src/a': {
        imports: [
          'src/b',
          'src/c',
        ],
        dependents: [],
      },
      'src/b': {
        imports: [],
        dependents: [
          'src/a',
        ],
      },
      'src/c': {
        imports: [],
        dependents: [
          'src/a',
        ],
      },
    })
  })
})
