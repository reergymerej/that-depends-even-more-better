# that-depends

Look through source, find dependencies.


## Usage

```js
import thatDepends from 'that-depends'

const deps = thatDepends('some/glob/to/src/**/*.js')
```

```
'/Users/bork/src/modules/oozer.js': [ '../../bingo', './foo' ],
'/Users/bork/src/modules/user.js': [ './helpers', 'values' ],
'/Users/bork/src/theme/_utilities.scss': [],
'/Users/bork/src/user.js': [ './user.js', 'redux', 'values' ],
```
