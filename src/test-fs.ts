import { FileSystem, AccessError } from '@tmplr/core'
import { Volume, IFs, createFsFromVolume } from 'memfs'
import { join, isAbsolute, dirname, relative, normalize, resolve, basename } from 'path'


export type FakeFiles = {[path: string]: string}
export type FakeRemotes = {[url: string]: FakeFiles}


function createTestFSFromVolume(
  _root: string,
  _scope: string,
  volume: IFs,
  remotes: FakeRemotes,
): FileSystem & { volume: IFs } {
  const root = resolve(_root)
  const scope = resolve(_scope)

  const checkSubPath = (path: string) => {
    const rel = relative(scope, path)
    if (isAbsolute(rel) || rel.startsWith('..')) {
      throw new AccessError(path, scope)
    }
  }

  checkSubPath(root)

  const absolute = (path: string) => normalize(isAbsolute(path) ? path : join(root, path))

  const ensureSubPath = async (path: string) => {
    checkSubPath(path)
    const abs = absolute(path)
    const rel = relative(root, abs)
    const dir = dirname(rel)

    if (dir !== '.') {
      await volume.promises.mkdir(absolute(dir), { recursive: true })
    }
  }

  return {
    volume,
    root,
    scope,
    absolute: jest.fn(absolute),
    basename: jest.fn(basename),
    dirname: jest.fn(dirname),
    read: jest.fn(async (path: string) => {
      const abs = absolute(path)
      checkSubPath(abs)

      return (await volume.promises.readFile(abs, 'utf8')) as string
    }),
    write: jest.fn(async (path: string, content: string) => {
      const abs = absolute(path)
      checkSubPath(abs)
      await ensureSubPath(abs)

      await volume.promises.writeFile(abs, content)
    }),
    access: jest.fn(async (path: string) => {
      const abs = absolute(path)
      checkSubPath(abs)
      await volume.promises.access(abs)
    }),
    rm: jest.fn(async (path: string) => {
      const abs = absolute(path)
      checkSubPath(abs)
      await volume.promises.rm(abs, { recursive: true, force: true })
    }),
    fetch: jest.fn(async (remote: string, dest: string) => {
      const abs = absolute(dest)
      checkSubPath(abs)

      if (remote in remotes) {
        for(const [path, content] of Object.entries(remotes[remote]!)) {
          const _abs = absolute(join(dest, path))
          checkSubPath(_abs)
          await ensureSubPath(_abs)
          volume.promises.writeFile(_abs, content)
        }
      } else {
        throw new Error('Remote not found.')
      }
    }),
    cd: jest.fn((path: string) => {
      const abs = absolute(path)
      checkSubPath(abs)

      return createTestFSFromVolume(abs, scope, volume, remotes)
    })
  }
}


export type TestFSOptions = {
  files?: FakeFiles
  remotes?: FakeRemotes
  root?: string
  scope?: string
}


export function createTestFS(options: TestFSOptions= {}) {
  const files: FakeFiles = {}
  const root = options.root || '/'
  const scope = options.scope || '/'

  if (options.files) {
    Object.entries(options.files).forEach(([path, content]) => {
      if (isAbsolute(path)) {
        files[path] = content
      } else {
        files[normalize(join(root, path))] = content
      }
    })
  }

  return createTestFSFromVolume(
    root,
    scope,
    createFsFromVolume(Volume.fromJSON(files)),
    options.remotes || {}
  )
}
