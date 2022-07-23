# @tmplr/jest

[![tests](https://github.com/loreanvictor/tmplr-jest/actions/workflows/test.yml/badge.svg)](https://github.com/loreanvictor/tmplr-jest/actions/workflows/test.yml)
[![coverage](https://github.com/loreanvictor/tmplr-jest/actions/workflows/coverage.yml/badge.svg)](https://github.com/loreanvictor/tmplr-jest/actions/workflows/coverage.yml)
[![version](https://img.shields.io/npm/v/@tmplr/jest?logo=npm)](https://www.npmjs.com/package/@tmplr/jest)

Utilities for testing [tmplr](https://github.com/loreanvictor/tmplr) packages using jest.

```bash
npm i @tmplr/jest --save-dev
```

<br>

## Usage

You need to have [Jest](https://jestjs.io) installed and setup. Utilities provided by this package are only usable where Jest's globals are registered in the environment.

```ts
import { createTestSetup } from '@tmplr/jest'


test('stuff work ...', async () => {
  const { fs, log, scope, context, varcontext } = createTestSetup({
    files: {
      '/some/file.txt': 'its content',
      'relative.yml': 'some other content',
    },
    remotes: {
      'https://github.com/user/repo': {
        'README.md': 'some content',
        'other-file.js': 'console.log("HOLA!")',
      }
    },
    providers: {
      stuff: {
        thingy: async () => 'Ladida'
      }
    },
  })
 
  // 👉 write tests here ...
})
```

☝️ `createTestSetup()` function gets a test environment (with filesystem, available remotes, and data providers) and provides the basic primitives
allowing you to create core tmplr constructs (such as runnables and executions) and test their behavior in the test environment you have created.

- `fs` is a tmplr-compliance filesystem whose methods are also [spiable Jest functions](https://jestjs.io/docs/mock-functions).
- `log` is a change log recording all _changes_ applied by executed runnables.
- `scope` is the main execution scope, variables read by runnables will be available here, as will values provided via specified providers. Its methods are also spiable Jest functions.
- `context` is an evaluation context (bound to `scope`) specifically for evaluating expressions within tmplr recipes.
- `varcontext` is an external evaluation context, which is suitable for evaluating expressions in other files. In this context, only variables stored during execution are available (through a special namespace, which can be specified via `varprefix` option).

<br>

⚠️⚠️ WORK IN PROGRESS. DO NOT USE. ⚠️⚠️
