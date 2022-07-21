import { providerFromFunctions } from '@tmplr/core'
import { createTestScope } from '../test-scope'


describe(createTestScope, () => {
  test('creates a scope using given functions.', async () => {
    const scope = createTestScope({
      providers: {
        stuff: {
          foo: async () => 'Foo',
          bar: async () => 'Bar',
        },
        premade: providerFromFunctions({
          baz: async () => 'Baz',
        })
      }
    })

    await expect(scope.has('stuff.foo')).resolves.toBe(true)
    await expect(scope.get('stuff.bar')).resolves.toBe('Bar')
    await expect(scope.has('premade.baz')).resolves.toBe(true)
    await expect(scope.has('stuff.baz')).resolves.toBe(false)

    expect(scope.has).toHaveBeenCalledWith('stuff.foo')
    expect(scope.get).toHaveBeenCalledWith('stuff.bar')
    expect(scope.has).toHaveBeenCalledWith('premade.baz')

    expect(scope.providers['stuff']!.has).toHaveBeenCalledWith('foo')
  })

  test('creates an empty scope without any parameters.', async () => {
    const scope = createTestScope()

    await expect(scope.has('stuff.foo')).resolves.toBe(false)
    await expect(scope.get('stuff.bar')).rejects.toThrow()
    await expect(scope.has('premade.baz')).resolves.toBe(false)
    await expect(scope.has('stuff.baz')).resolves.toBe(false)

    expect(scope.has).toHaveBeenCalledWith('stuff.foo')
    expect(scope.get).toHaveBeenCalledWith('stuff.bar')
    expect(scope.has).toHaveBeenCalledWith('premade.baz')
  })
})
