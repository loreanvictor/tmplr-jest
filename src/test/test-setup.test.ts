import { Eval, Read, Steps, Update, Value } from '@tmplr/core'
import { createTestSetup } from '../test-setup'


describe(createTestSetup, () => {
  test('provides a test setup for testing tmplr stuff.', async () => {
    const { fs, scope, log, context, varcontext } = createTestSetup({
      files: {
        '/foo.md': '# Hi {{ tmplr.name }}!',
      },
      providers: {
        stuff: {
          foo: async () => 'jack',
        }
      },
      varprefix: 'tmplr'
    })

    await new Steps([
      new Read('name', new Eval('{{ stuff.foo | Capital Case }}', context), scope),
      new Update(new Value('foo.md'), false, fs, varcontext, log),
    ]).run().execute()

    await expect(fs.read('foo.md')).resolves.toBe('# Hi Jack!')
  })

  test('also creates an empty setup.', async () => {
    const { scope, context } = createTestSetup()

    await expect(scope.vars.has('_.halo')).resolves.toBe(false)

    await new Read('halo', new Eval('world', context), scope).run().execute()

    await expect(scope.vars.has('_.halo')).resolves.toBe(true)
    await expect(scope.vars.get('_.halo')).resolves.toBe('world')
  })
})
