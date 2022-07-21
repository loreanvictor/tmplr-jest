import { ChangeLog, EvaluationContext, PipeMap, PipeRegistry, STANDARD_PIPES } from '@tmplr/core'

import { createTestFS, TestFSOptions } from './test-fs'
import { createTestScope, TestScopeOptions } from './test-scope'


export type TestSetupOptions = TestFSOptions & TestScopeOptions & {
  pipes?: PipeRegistry | PipeMap
}


export function createTestSetup(options: TestSetupOptions = {}) {
  const fs = createTestFS(options)
  const scope = createTestScope(options)
  const log = new ChangeLog()
  const context = new EvaluationContext(scope, options.pipes || STANDARD_PIPES)
  const varcontext = new EvaluationContext(scope.vars, options.pipes || STANDARD_PIPES)


  return {
    fs,
    scope,
    log,
    context,
    varcontext,
  }
}
