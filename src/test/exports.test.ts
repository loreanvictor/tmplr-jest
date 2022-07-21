import {
  createTestFS, FakeFiles, FakeRemotes, TestFSOptions,
  createTestScope, FakeProvider, FakeProviders, TestScopeOptions,
  createTestSetup, TestSetupOptions,
} from '../'


test('everything is exported properly.', () => {
  expect(createTestFS).toBeDefined()
  expect(<FakeFiles>{}).toBeDefined()
  expect(<FakeRemotes>{}).toBeDefined()
  expect(<TestFSOptions>{}).toBeDefined()
  expect(createTestScope).toBeDefined()
  expect(<FakeProvider>{}).toBeDefined()
  expect(<FakeProviders>{}).toBeDefined()
  expect(<TestScopeOptions>{}).toBeDefined()
  expect(createTestSetup).toBeDefined()
  expect(<TestSetupOptions>{}).toBeDefined()
})
