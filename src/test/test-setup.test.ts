import { Eval, Read, Steps, Update, Value } from '@tmplr/core'
import { createTestSetup } from '../test-setup'


describe(createTestSetup, () => {
  test('provides a test setup for testing tmplr stuff.', async () => {
    const { fs, scope, log, context, varcontext, flow } = createTestSetup({
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
      new Update(new Value('foo.md'), fs, varcontext, { log }),
    ]).run(flow).execute()

    await expect(fs.read('foo.md')).resolves.toBe('# Hi Jack!')
  })

  test('also creates an empty setup.', async () => {
    const { scope, context, flow } = createTestSetup()

    await expect(scope.vars.has('_.halo')).resolves.toBe(false)

    await new Read('halo', new Eval('world', context), scope).run(flow).execute()

    await expect(scope.vars.has('_.halo')).resolves.toBe(true)
    await expect(scope.vars.get('_.halo')).resolves.toBe('world')
  })
})
