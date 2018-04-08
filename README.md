# that-depends

Look through source, find dependencies.


## Usage

### CLI

```sh
that-depends path/to/src/
```

### Programatic

```js
import thatDepends from 'that-depends'

const deps = thatDepends('some/glob/to/src/**/*.js')
```
