import { providerFromFunctions, ProviderNamespace, Provider, Scope, scopeFromProviders } from '@tmplr/core'


export type FakeProvider = {[name: string]: () => Promise<string>}
export type FakeProviders = {[name: string]: Provider | FakeProvider}


function isRealProvider(provider: Provider | FakeProvider): provider is Provider {
  return typeof provider === 'object' && typeof provider.get === 'function' && typeof provider.has === 'function'
}


function spy(provider: Provider): Provider {
  return {
    get: jest.fn(provider.get),
    has: jest.fn(provider.has),
  }
}


function createTestProviders(providers: FakeProviders) {
  const res: ProviderNamespace = {}

  Object.entries(providers).forEach(([name, fns]) => {
    if (isRealProvider(fns)) {
      res[name] = spy(fns)
    } else {
      res[name] = spy(providerFromFunctions(fns))
    }
  })

  return res
}


export type TestScopeOptions = {
  providers?: FakeProviders
  varprefix?: string
}


export function createTestScope(options: TestScopeOptions = {}): Scope & {providers: ProviderNamespace} {
  const providers = createTestProviders(options.providers || {})
  const scope = scopeFromProviders(providers, options.varprefix || '_')

  return {
    providers,
    vars: scope.vars,
    get: jest.fn(scope.get),
    has: jest.fn(scope.has),
    set: jest.fn(scope.set),
    sub: jest.fn(scope.sub),
    cleanup: jest.fn(scope.cleanup),
  }
}
