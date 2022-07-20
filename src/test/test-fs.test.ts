import { AccessError } from '@tmplr/core'
import { createTestFS } from '../test-fs'


describe(createTestFS, () => {
  test('can read files that are given.', async () => {
    const fs = createTestFS({
      files: {
        '/stuff': 'hellow'
      }
    })

    await expect(fs.read('stuff')).resolves.toBe('hellow')
    expect(fs.read).toBeCalledWith('stuff')
  })

  test('can also write some files.', async () => {
    const fs = createTestFS()

    await fs.write('/conf/stuff', 'hellow')
    expect(fs.write).toBeCalledWith('/conf/stuff', 'hellow')

    await expect(fs.cd('conf').read('stuff')).resolves.toBe('hellow')
  })

  test('cannot access files out of scope.', async () => {
    const fs = createTestFS({
      files: {
        '/conf/stuff': 'yellow',
        '/home/stuff': 'blue'
      },
      root: '/home',
      scope: '/home',
    })

    await expect(fs.read('/conf/stuff')).rejects.toThrow(AccessError)
    await expect(fs.read('/home/stuff')).resolves.toBe('blue')
  })

  test('can access files in scope.', async () => {
    const fs = createTestFS({
      files: {
        '/conf/stuff': 'yellow',
        '/home/stuff': 'blue'
      },
      root: '/home',
      scope: '/home',
    })

    await expect(fs.access('/home/stuff')).resolves.not.toThrow()
    await expect(fs.access('/conf/stuff')).rejects.toThrow(AccessError)

    expect(fs.access).toBeCalledWith('/conf/stuff')
    expect(fs.access).toBeCalledWith('/home/stuff')
  })

  test('can remove files in scope.', async () => {
    const fs = createTestFS({
      files: {
        '/conf/stuff': 'yellow',
        '/home/stuff': 'blue'
      },
      root: '/home',
      scope: '/home',
    })

    await fs.rm('/home/stuff')
    expect(fs.rm).toBeCalledWith('/home/stuff')

    await expect(fs.cd('home').read('stuff')).rejects.toThrow()
    await expect(fs.rm('/conf/stuff')).rejects.toThrow(AccessError)
  })

  test('can fetch files from remote.', async () => {
    const fs = createTestFS({
      remotes: {
        'https://example.com': {
          'bla/stuff': 'yellow',
          'stuff': 'blue'
        }
      },
      root: '/home',
      scope: '/home',
    })

    await fs.fetch('https://example.com', 'bla')
    expect(fs.fetch).toBeCalledWith('https://example.com', 'bla')

    await expect(fs.fetch('https://other-example.com', 'somewhere')).rejects.toThrow()

    await expect(fs.read('/home/bla/bla/stuff')).resolves.toBe('yellow')
    await expect(fs.read('/home/bla/stuff')).resolves.toBe('blue')
  })
})